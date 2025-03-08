<<<<<<< HEAD
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  created_at: string;
  user_id: string;
  priority?: number;
  flowOptimal?: boolean;
  contextCost?: number;
  completed?: boolean;
  progress?: number;
  completionMetrics?: any; // TODO: Define a proper interface for completionMetrics
  dependencies?: string[]; // Assuming dependencies are strings (task IDs)
  estimatedDuration: number; // Add estimatedDuration
  estimated_duration: number; // Add estimated_duration (with underscore - to handle both cases for now)
}

export interface TaskFlowMetrics {
  focus_duration: number;
  interruptions: number;
  completion_time: number | null;
  flow_score: number;
  productivity_score: number;
}

export interface TaskUpdate {
  id: string;
  flow_metrics: TaskFlowMetrics;
}

export interface TaskFlowSession {
  tasks: string[]; // Array of task IDs
  interruptions: number;
  start_time: string;
  end_time?: string; // Optional end time
  flow_score: number;
  completed_tasks: string[]; // Array of completed task IDs
}

export interface TaskPriorityFactors { // <--- ADDED TaskPriorityFactors interface
  urgency: number;
  importance: number;
  flowAlignment: number;
  complexity: number;
}

export interface TaskPriorityScore {
  score: number;
  factors: TaskPriorityFactors; 
}

export interface TaskAssignmentMatch {
  userId: string;
  score: number;
  flowScore: number;
  workloadScore: number;
  expertiseScore: number;
  reasons: string[];
}
=======
import type { Task } from './database';
import type { FlowState, FlowPreferences } from './flow';

export interface TaskRoutingResult {
  suggestedSequence: Task[];
  routingFactors: TaskRoutingFactors;
  recommendations: string[];
  metadata: TaskRoutingMetadata;
}

export interface TaskRoutingFactors {
  flowAlignment: number;
  timingOptimality: number;
  workloadBalance: number;
  contextContinuity: number;
  taskScores: Record<string, number>;
}

export interface TaskRoutingMetadata {
  routingTimestamp: string;
  flowScore: number;
  sequenceScore: number;
  estimated_duration?: number;
}

export interface TaskRoutingConfig {
  flowState: FlowState;
  preferences: FlowPreferences;
  currentTasks: Task[];
  teamContext?: {
    activeMemberCount: number;
    averageFlowScore: number;
    syncInProgress: boolean;
  };
}

export interface TaskDurationEstimate {
  min: number;   // in minutes
  max: number;   // in minutes
  confidence: number;  // 0-1
}

export interface TaskFlowMetrics {
  estimatedDuration: TaskDurationEstimate;
  complexity: number;  // 0-100
  flowAlignment: number;  // 0-1
  contextSwitchCost: number;  // 0-1
  teamImpact: number;  // 0-1
}

export interface TaskRoutingOptions {
  optimizeFor?: 'individual' | 'team' | 'balanced';
  minFlowScore?: number;
  maxDuration?: number;
  priorityWeight?: number;
  deadlineWeight?: number;
  complexityWeight?: number;
  contextWeight?: number;
}

// Extended Task interface with flow-specific properties
export interface FlowTask extends Task {
  flowMetrics?: TaskFlowMetrics;
  routingScore?: number;
  previousContext?: string[];
  nextContext?: string[];
  estimated_duration?: number;
}
>>>>>>> 7d9ee070489d2151403e6b883b553afda5d85c0e
