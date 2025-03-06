-- Create enum for flow status
create type flow_status as enum ('peak', 'flow', 'rest', 'building');

-- Create flow_states table
create table flow_states (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  score integer not null check (score >= 0 and score <= 100),
  status flow_status not null,
  active_time integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Create flow_history table for tracking historical flow states
create table flow_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  score integer not null check (score >= 0 and score <= 100),
  status flow_status not null,
  active_time integer not null,
  started_at timestamp with time zone not null,
  ended_at timestamp with time zone not null
);

-- Create flow_sync_events table for team synchronization
create table flow_sync_events (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references teams not null,
  user_id uuid references auth.users not null,
  event_type text not null,
  payload jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for performance
create index flow_states_user_id_idx on flow_states(user_id);
create index flow_history_user_id_idx on flow_history(user_id);
create index flow_history_started_at_idx on flow_history(started_at);
create index flow_sync_events_team_id_idx on flow_sync_events(team_id);
create index flow_sync_events_created_at_idx on flow_sync_events(created_at);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger for flow_states
create trigger set_updated_at
  before update on flow_states
  for each row
  execute function update_updated_at_column();

-- Row level security policies
alter table flow_states enable row level security;
alter table flow_history enable row level security;
alter table flow_sync_events enable row level security;

-- Policies for flow_states
create policy "Users can view their own flow state"
  on flow_states for select
  using (auth.uid() = user_id);

create policy "Users can update their own flow state"
  on flow_states for update
  using (auth.uid() = user_id);

create policy "Users can insert their own flow state"
  on flow_states for insert
  with check (auth.uid() = user_id);

-- Policies for flow_history
create policy "Users can view their own flow history"
  on flow_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own flow history"
  on flow_history for insert
  with check (auth.uid() = user_id);

-- Policies for flow_sync_events
create policy "Team members can view team sync events"
  on flow_sync_events for select
  using (
    exists (
      select 1 from team_members
      where team_members.team_id = flow_sync_events.team_id
      and team_members.user_id = auth.uid()
    )
  );

create policy "Team members can insert team sync events"
  on flow_sync_events for insert
  with check (
    exists (
      select 1 from team_members
      where team_members.team_id = flow_sync_events.team_id
      and team_members.user_id = auth.uid()
    )
  );
