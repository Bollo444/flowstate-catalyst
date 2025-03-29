-- Migration to create the projects table
create table projects (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    team_id uuid references teams(id) on delete cascade not null, -- Assuming projects belong to teams
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Add indexes for common queries
create index projects_team_id_idx on projects(team_id);

-- Function to update updated_at timestamp (can reuse the one from tasks if needed, or define specific one)
-- For simplicity, let's assume a generic update function exists or create one if needed.
-- Using the same function name for consistency if it handles multiple tables:
create or replace function update_task_updated_at() -- Reusing function name, but could be generic e.g., update_updated_at_column
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Trigger for updated_at
create trigger projects_updated_at
    before update on projects
    for each row
    execute function update_task_updated_at(); -- Execute the same function

-- RLS Policies for Projects
alter table projects enable row level security;

-- Team members can view projects of their team
create policy "Team members can view their team projects"
    on projects for select
    using (team_id in (
        select team_id from team_members
        where user_id = auth.uid()
    ));

-- Team members can create projects for their team
create policy "Team members can create projects for their team"
    on projects for insert
    with check (team_id in (
        select team_id from team_members
        where user_id = auth.uid()
    ));

-- Team members can update projects of their team
create policy "Team members can update their team projects"
    on projects for update
    using (team_id in (
        select team_id from team_members
        where user_id = auth.uid()
    ));

-- Team members can delete projects of their team (Consider if this is too permissive)
create policy "Team members can delete their team projects"
    on projects for delete
    using (team_id in (
        select team_id from team_members
        where user_id = auth.uid()
    ));

-- Grant usage on schema public to anon and authenticated roles if needed
-- Supabase usually handles this, but ensure permissions are correct.