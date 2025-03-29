-- Integration tables
CREATE TABLE team_spaces (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID REFERENCES team_spaces(id),
    user_id UUID REFERENCES auth.users(id),
    role TEXT DEFAULT 'member',
    status TEXT DEFAULT 'active',
    last_active TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Flow Streak Tables
CREATE TABLE user_streaks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_active_date DATE,
    total_days_active INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Integration tables
CREATE TABLE user_integrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    provider TEXT NOT NULL,
    type TEXT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    last_sync TIMESTAMP WITH TIME ZONE
);

CREATE TABLE integration_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    integration_id UUID REFERENCES user_integrations(id),
    data_type TEXT NOT NULL,
    data JSONB,
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);


-- Row-Level Security Policies --

-- Enable RLS for all tables --
ALTER TABLE team_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_data ENABLE ROW LEVEL SECURITY;

-- Policies for team_spaces --
-- Allow authenticated users to read all teams (can be restricted later if needed)
CREATE POLICY "Allow read access to authenticated users" 
  ON team_spaces FOR SELECT 
  USING (auth.role() = 'authenticated');
-- Allow authenticated users to create teams
CREATE POLICY "Allow authenticated users to create teams" 
  ON team_spaces FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');
-- Note: UPDATE/DELETE policies might require role checks (e.g., team admin)

-- Policies for team_members --
-- Allow users to view their own membership record
CREATE POLICY "Allow users to view own membership" 
  ON team_members FOR SELECT 
  USING (auth.uid() = user_id);
-- Allow users to view members of teams they are part of
CREATE POLICY "Allow users to view members of their teams" 
  ON team_members FOR SELECT 
  USING (EXISTS (SELECT 1 FROM team_members tm WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid()));
-- Note: INSERT/UPDATE/DELETE policies need careful consideration (e.g., team invites, admin roles)

-- Policies for user_streaks --
-- Allow users full control over their own streak record
CREATE POLICY "Allow users to manage their own streak" 
  ON user_streaks FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_integrations --
-- Allow users full control over their own integrations
CREATE POLICY "Allow users to manage their own integrations" 
  ON user_integrations FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for integration_data --
-- Allow users full control over data linked to their integrations
CREATE POLICY "Allow users to manage data for their integrations" 
  ON integration_data FOR ALL 
  USING (EXISTS (SELECT 1 FROM user_integrations ui WHERE ui.id = integration_data.integration_id AND ui.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM user_integrations ui WHERE ui.id = integration_data.integration_id AND ui.user_id = auth.uid()));



-- Flow Session Table --
CREATE TABLE flow_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    team_id UUID REFERENCES team_spaces(id),
    start_time TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    initial_state JSONB,
    type TEXT DEFAULT 'focus',
    settings JSONB DEFAULT '{}',
    summary JSONB
);

-- Enable RLS for flow_sessions --
ALTER TABLE flow_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for flow_sessions --
-- Allow users full control over their own sessions
CREATE POLICY "Allow users to manage their own flow sessions" 
  ON flow_sessions FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);



-- Indexes for Performance --

-- Indexes for flow_sessions table
CREATE INDEX idx_flow_sessions_user_id ON flow_sessions(user_id);
CREATE INDEX idx_flow_sessions_team_id ON flow_sessions(team_id);
CREATE INDEX idx_flow_sessions_start_time ON flow_sessions(start_time);
CREATE INDEX idx_flow_sessions_end_time ON flow_sessions(end_time);

-- Index for flow_states table (assuming table exists)
-- CREATE INDEX idx_flow_states_user_id ON flow_states(user_id); 
-- Uncomment above line if/when flow_states table is formally defined in schema

-- Add indexes for other tables as needed, e.g., team_members
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);

CREATE INDEX idx_user_streaks_user_id ON user_streaks(user_id);
CREATE INDEX idx_user_integrations_user_id ON user_integrations(user_id);
CREATE INDEX idx_integration_data_integration_id ON integration_data(integration_id);
