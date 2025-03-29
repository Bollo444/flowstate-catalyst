import { FlowStatus } from "./supabase";

export interface FlowState {
  score: number;
  status: FlowStatus;
  activeTime: number;
  interruptions: number;
  taskCompletions: number;
}

export interface ActivityMetrics {
  activeTime: number; // Current session active time in minutes
  taskCompletions: number; // Tasks completed in current session
  contextSwitches: number; // Number of times switched between tasks
  lastBreakTime?: Date; // Last time user took a break
  dayProgress: number; // 0-1 representing time through user's work day
  interruptions: number; // Number of interruptions in current session
  interruptedTime: number; // Total time spent interrupted in minutes
}

export interface FlowAnalytics {
  dailyFlowTime: number; // Total time in flow state today
  peakFlowTime: number; // Total time in peak flow state today
  averageFlowScore: number; // Average flow score for the day
  completedTasks: number; // Number of tasks completed today
  breaksTaken: number; // Number of breaks taken today
}

export interface TeamFlowMetrics {
  teamFlow: number;
  activeMembers: number;
  peakFlowCount: number;
  averageFlowScore: number;
}

export interface FlowStateStore {
  members: Map<string, TeamMemberStatus>;
  activeSession: FlowSession | null;
  metrics: TeamFlowMetrics;
  updates: FlowUpdate[];
}

export interface FlowSession {
  id: string;
  startTime: Date;
  // Add properties used by FlowSessionService
  userId: string;
  teamId?: string;
  initialState?: FlowState; // Snapshot of state at start
  participants: Set<string>;
  type: "focus" | "collaboration";
  goal?: string;
  settings?: Record<string, any>; // Settings used for the session
}

export interface FlowUpdate {
  userId: string;
  flowState: FlowState;
  type: "status" | "interruption" | "completion";
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

export interface TeamMemberStatus {
  userId: string;
  status: "active" | "inactive" | "focus";
  flowState: FlowState;
  lastUpdate: Date;
  currentTask?: string;
}

// --- Interfaces related to FlowSessionService ---

export interface FlowSessionConfig {
  userId: string;
  teamId?: string;
  initialState: FlowState;
  type?: "focus" | "collaboration";
  settings?: Record<string, any>;
}

export interface SessionSummary {
  startTime: Date;
  // Assuming transitions track state changes within the session
  transitions: { to: FlowStatus; duration: number }[];
  // Include other fields that might be needed for calculations (e.g., tasks completed)
  taskCompletions?: number;
}

export interface SessionResult {
  sessionId: string;
  duration: number; // milliseconds
  flowScore: number; // Average score?
  productivity: number; // Percentage
  insights: Record<string, any>; // Placeholder for generated insights
}
