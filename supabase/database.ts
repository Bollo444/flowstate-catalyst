import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

export async function createDatabaseSchema() {
  const sql = `
    -- Core Tables

    -- Users Table (extends Supabase auth)
    CREATE TABLE IF NOT EXISTS users (
        id UUID REFERENCES auth.users PRIMARY KEY,
        email TEXT UNIQUE,
        full_name TEXT,
        avatar_url TEXT,
        flow_settings JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
    );

    -- Projects Table
    CREATE TABLE IF NOT EXISTS projects (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'active',
        flow_state_data JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
    );

    -- Tasks Table
    CREATE TABLE IF NOT EXISTS tasks (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        project_id UUID REFERENCES projects(id),
        user_id UUID REFERENCES users(id),
        title TEXT NOT NULL,
        description TEXT,
        priority TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'pending',
        due_date TIMESTAMP WITH TIME ZONE,
        flow_metrics JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
    );

    -- File Analysis Table
    CREATE TABLE IF NOT EXISTS file_analysis (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        file_name TEXT NOT NULL,
        file_type TEXT,
        analysis_result JSONB,
        project_id UUID REFERENCES projects(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
        status TEXT DEFAULT 'pending'
    );

    -- Flow Metrics Table
    CREATE TABLE IF NOT EXISTS flow_metrics (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        date DATE DEFAULT CURRENT_DATE,
        flow_score INTEGER,
        focus_duration INTEGER,
        task_completion_rate FLOAT,
        metrics_data JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
    );
  `;

  try {
    const { error } = await supabase.rpc('run_sql', { sql });
    if (error) {
      console.error('Error creating database schema:', error);
      return { success: false, error: error.message };
    } else {
      console.log('Database schema created successfully');
      return { success: true };
    }
  } catch (e) {
    console.error('Error creating database schema:', e);
    return { success: false, error: e.message };
  }
}