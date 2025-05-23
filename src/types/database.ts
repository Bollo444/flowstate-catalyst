// Define common types used across tables
export type FlowStatus = 'peak' | 'flow' | 'rest' | 'building';
export type TaskStatus = 'active' | 'completed' | 'archived'; // Matches migration enum
export type Json = any; // Placeholder for JSON type, used for completion_metrics

// Define the structure for individual tables within the 'public' schema
export interface Tables {
  teams: {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
  };
  team_members: {
    user_id: string;
    team_id: string;
    role: string;
    joined_at: string;
  };
  team_invites: {
    id: string;
    team_id: string;
    inviter_id: string;
    invitee_email: string;
    role: string;
    created_at: string;
    expires_at: string;
  };
  flow_states: {
    id: string;
    user_id: string;
    score: number;
    status: FlowStatus;
    active_time: number;
    created_at: string;
    updated_at: string;
  };
  flow_history: {
    id: string;
    user_id: string;
    score: number;
    status: FlowStatus;
    active_time: number;
    started_at: string;
    ended_at: string;
  };
  flow_sync_events: {
    id: string;
    team_id: string;
    user_id: string;
    event_type: string;
    payload: Json;
    created_at: string;
  };
  projects: {
    id: string;
    name: string;
    description: string | null;
    team_id: string;
    created_at: string;
    updated_at: string;
  };
  tasks: {
    id: string;
    title: string;
    description: string | null;
    priority: number;
    flow_optimal: boolean;
    context_cost: number;
    estimated_duration: number;
    completed: boolean;
    user_id: string;
    team_id: string | null;
    project_id: string | null;
    due_date: string | null;
    created_at: string;
    updated_at: string;
    status: TaskStatus;
    completion_metrics: Json | null;
  };
  task_comments: {
    id: string;
    task_id: string;
    user_id: string;
    content: string;
    created_at: string;
    updated_at: string;
  };
  profiles: { // Correct table name for user profiles
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    website: string | null;
    updated_at: string | null;
    flow_enabled: boolean;
    preferred_working_hours_start: string | null;
    preferred_working_hours_end: string | null;
  };
  team_member_status: {
    user_id: string;
    team_id: string;
    status?: "active" | "inactive" | "focus" | string | null; // Status field
    flow_state_id?: string | null; // Link to flow_states?
    last_update?: string | null; // Common timestamp
    created_at?: string | null; // Common timestamp
  };
  team_syncs: { // Added missing table definition
      id: string;
      team_id: string;
      participants: string[];
      start_time: string;
      end_time: string | null;
      status: "active" | "paused" | "ended";
      focus_score: number;
      created_at?: string;
      updated_at?: string;
  };
}

// Define the overall database structure
export interface Database {
  public: {
    Tables: Tables;
    // Add Functions and Enums if needed based on your schema
    // Functions: Record<string, never>;
    // Enums: Record<string, never>;
  };
}

// Export individual table types for convenience
export type Team = Tables['teams'];
export type TeamMember = Tables['team_members'];
export type TeamInvite = Tables['team_invites'];
export type FlowState = Tables['flow_states'];
export type FlowHistory = Tables['flow_history'];
export type FlowSyncEvent = Tables['flow_sync_events'];
export type Project = Tables['projects'];
export type Task = Tables['tasks'];
export type TaskComment = Tables['task_comments'];
export type Profile = Tables['profiles'];
export type TeamMemberStatus = Tables['team_member_status'];
export type TeamSync = Tables['team_syncs']; // Added export

// Define FocusPreferences based on its usage
export interface FocusPreferences {
  preferredFocusHours?: number[] | null;
}

// Re-defining TeamMemberStatus interface with potential joined data properties
// based on usage observed in useTeamData or similar hooks.
// Note: This may need adjustment based on actual query results.
export interface TeamMemberStatusWithDetails extends TeamMemberStatus {
  user?: Profile | null;                         // Joined from profiles table
  flowState?: FlowState | null;             // Joined from flow_states?
  focusPreferences?: FocusPreferences | null;   // Joined from profiles?
  lastUpdate?: string | null;               // Potential alias for team_member_status.last_update
  currentTask?: string | null;             // Joined from tasks?
  // updated_at field already exists in TeamMemberStatus from Tables definition
}