import { FlowStatus } from './supabase';

export interface FlowState {
  userId: string;
  score: number;
  status: FlowStatus;
  activeTime: number;
  lastUpdated: string;
}

export interface ActivityMetrics {
  activeTime: number;          // Current session active time in minutes
  taskCompletions: number;     // Tasks completed in current session
  contextSwitches: number;     // Number of times switched between tasks
  lastBreakTime?: Date;        // Last time user took a break
  dayProgress: number;         // 0-1 representing time through user's work day
}

export interface FlowAnalytics {
  dailyFlowTime: number;      // Total time in flow state today
  peakFlowTime: number;       // Total time in peak flow state today
  averageFlowScore: number;   // Average flow score for the day
  completedTasks: number;     // Number of tasks completed today
  breaksTaken: number;        // Number of breaks taken today
}

export interface TeamFlowMetrics {
  teamId: string;
  teamFlowScore: number;      // Average flow score across team
  membersInFlow: number;      // Number of team members in flow state
  syncedTasks: number;        // Number of tasks being worked on together
  collaborationScore: number; // Measure of team collaboration effectiveness
}
