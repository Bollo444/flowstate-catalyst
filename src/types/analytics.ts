import { FlowStatus } from './supabase';

export interface FlowHistoryEntry {
  id: string;
  user_id: string;
  score: number;
  status: FlowStatus;
  active_time: number;
  created_at: string;
}

export interface TaskHistoryEntry {
  id: string;
  user_id: string;
  title: string;
  flow_optimal: boolean;
  context_cost: number;
  completed_at: string;
  completion_metrics?: {
    flowScore: number;
    completionTime: number;
    timestamp: string;
  };
}

export interface FlowScoreDataPoint {
  time: string;
  score: number;
}

export interface TaskCompletionDataPoint {
  day: string;
  completed: number;
  optimal: number;
}

export interface AverageMetrics {
  flowScore: number;
  activeTime: number;
  contextSwitches: number;
  taskCompletions: number;
}

export interface MetricTrends {
  flowScore: number;
  taskCompletion: number;
  contextSwitching: number;
  activeTime: number;
}

export interface AnalyticsMetrics {
  flowScoreHistory: FlowScoreDataPoint[];
  taskCompletion: TaskCompletionDataPoint[];
  averageMetrics: AverageMetrics;
  trends: MetricTrends;
}

export interface AnalyticsTimeRange {
  start: Date;
  end: Date;
}

export type TimeRangeOption = 'day' | 'week' | 'month';
