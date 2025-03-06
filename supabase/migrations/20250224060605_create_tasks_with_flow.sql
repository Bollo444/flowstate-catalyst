create type task_status as enum ('active', 'completed', 'archived');

create table tasks (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    priority integer not null default 50,
    flow_optimal boolean not null default false,
    context_cost numeric(4,3) not null default 0,
    estimated_duration integer not null,
    completed boolean not null default false,
    user_id uuid references auth.users(id) on delete cascade not null,
    team_id uuid references teams(id) on delete set null,
    project_id uuid references projects(id) on delete set null,
    due_date timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    status task_status not null default 'active',
    completion_metrics jsonb,
    constraint valid_priority check (priority >= 0 and priority <= 100),
    constraint valid_context_cost check (context_cost >= 0 and context_cost <= 1),
    constraint valid_duration check (estimated_duration >= 5 and estimated_duration <= 180)
);

-- Add indexes for common queries
create index tasks_user_id_idx on tasks(user_id);
create index tasks_team_id_idx on tasks(team_id);
create index tasks_project_id_idx on tasks(project_id);
create index tasks_status_idx on tasks(status);
create index tasks_completed_idx on tasks(completed);
create index tasks_due_date_idx on tasks(due_date);
create index tasks_flow_optimal_idx on tasks(flow_optimal);

-- Function to update updated_at timestamp
create or replace function update_task_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Trigger for updated_at
create trigger tasks_updated_at
    before update on tasks
    for each row
    execute function update_task_updated_at();

-- RLS Policies
alter table tasks enable row level security;

-- View own tasks
create policy "Users can view their own tasks"
    on tasks for select
    using (auth.uid() = user_id);

-- View team tasks
create policy "Users can view their team's tasks"
    on tasks for select
    using (team_id in (
        select team_id from team_members
        where user_id = auth.uid()
    ));

-- Create tasks
create policy "Users can create tasks"
    on tasks for insert
    with check (auth.uid() = user_id);

-- Update own tasks
create policy "Users can update their own tasks"
    on tasks for update
    using (auth.uid() = user_id);

-- Update team tasks
create policy "Users can update their team's tasks"
    on tasks for update
    using (team_id in (
        select team_id from team_members
        where user_id = auth.uid()
    ));

-- Delete own tasks
create policy "Users can delete their own tasks"
    on tasks for delete
    using (auth.uid() = user_id);

-- Comments for tasks
create table task_comments (
    id uuid default uuid_generate_v4() primary key,
    task_id uuid references tasks(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    content text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Add index for task comments
create index task_comments_task_id_idx on task_comments(task_id);

-- Trigger for task_comments updated_at
create trigger task_comments_updated_at
    before update on task_comments
    for each row
    execute function update_task_updated_at();

-- RLS for task comments
alter table task_comments enable row level security;

create policy "Users can view comments on accessible tasks"
    on task_comments for select
    using (
        task_id in (
            select id from tasks
            where user_id = auth.uid()
            or team_id in (
                select team_id from team_members
                where user_id = auth.uid()
            )
        )
    );

create policy "Users can create comments on accessible tasks"
    on task_comments for insert
    with check (
        task_id in (
            select id from tasks
            where user_id = auth.uid()
            or team_id in (
                select team_id from team_members
                where user_id = auth.uid()
            )
        )
    );

create policy "Users can update their own comments"
    on task_comments for update
    using (user_id = auth.uid());

create policy "Users can delete their own comments"
    on task_comments for delete
    using (user_id = auth.uid());
