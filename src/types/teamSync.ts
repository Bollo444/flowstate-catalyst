import type { FlowState, FlowStateStatus, TeamMemberStatus } from './flow';
import type { Task } from './database';

export interface TeamSync {
  id: string;
  team_id: string;
  start_time: string;       // ISO timestamp
  end_time: string | null;  // ISO timestamp
  status: 'active' | 'completed' | 'paused';
  participants: TeamMemberStatus[];
  current_focus: TeamFocus | null;
  messages: TeamSyncMessage[];
  metrics: TeamSyncMetrics;
}

export interface TeamFocus {
  type: 'task' | 'project';
  id: string;
  title: string;
  started_at: string;     // ISO timestamp
  participants: string[]; // user_ids
  expected_duration: number; // in minutes
  flow_score: number;    // 0-100
}

export interface TeamSyncMessage {
  id: string;
  user_id: string;
  type: 'message' | 'status_update' | 'system' | 'flow_insight';
  content: string;
  timestamp: string;      // ISO timestamp
  metadata?: {
    flow_score?: number;
    status_change?: {
      from: FlowStateStatus;
      to: FlowStateStatus;
    };
    related_task?: string;
    mention_ids?: string[];
  };
}

export interface TeamSyncMetrics {
  average_flow_score: number;
  peak_flow_score: number;
  collaboration_score: number;
  sync_duration: number;   // in seconds
  flow_alignment: number;  // 0-1
  interruption_count: number;
  tasks_completed: number;
  focus_time: number;     // in seconds
  participant_metrics: TeamParticipantMetrics[];
}

export interface TeamParticipantMetrics {
  user_id: string;
  flow_states: {
    timestamp: string;
    state: FlowStateStatus;
    score: number;
  }[];
  focus_time: number;     // in seconds
  contribution_score: number; // 0-1
  task_completion_rate: number; // 0-1
  average_flow_score: number;
}

export interface TeamSyncPreferences {
  auto_sync: boolean;
  min_participants: number;
  max_duration: number;   // in minutes
  break_interval: number; // in minutes
  notification_level: 'all' | 'important' | 'none';
  focus_alignment: boolean;
  flow_score_threshold: number;
}

export interface TeamSyncEvent {
  id: string;
  sync_id: string;
  type: TeamSyncEventType;
  user_id: string;
  timestamp: string;      // ISO timestamp
  metadata: Record<string, any>;
}

export type TeamSyncEventType =
  | 'member_joined'
  | 'member_left'
  | 'focus_started'
  | 'focus_ended'
  | 'flow_state_changed'
  | 'task_completed'
  | 'break_started'
  | 'break_ended'
  | 'sync_paused'
  | 'sync_resumed'
  | 'flow_milestone'
  | 'collaboration_insight';