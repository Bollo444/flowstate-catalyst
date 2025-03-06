export type FlowStatus = 'peak' | 'flow' | 'rest' | 'building';

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
    payload: Record<string, any>;
    created_at: string;
  };
}

export interface Database {
  public: Tables;
}

export interface SupabaseSession {
  user: {
    id: string;
    app_metadata: {
      provider: string;
    };
  };
}
