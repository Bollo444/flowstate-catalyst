// Import Status types from the single source of truth
import { FlowStatus, TaskStatus as DbTaskStatus } from "./database"; 

// Internal Task type using camelCase convention
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: DbTaskStatus; // Use the imported status type
  createdAt: string; // camelCase
  userId: string; // camelCase
  priority?: number;
  flowOptimal?: boolean;
  contextCost?: number;
  completed?: boolean;
  progress?: number;
  completionMetrics?: any; // TODO: Define a proper interface
  dependencies?: string[]; 
  estimatedDuration: number; // camelCase
  // Add optional DB-related fields if needed internally, ensure they are camelCase
  teamId?: string | null; 
  projectId?: string | null;
  dueDate?: string; // Should match internal usage, string | null | undefined?
}

// --- Other interfaces remain the same ---

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

export interface TaskPriorityFactors {
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
  taskId: string; 
}

import type { FlowState } from "./flow";

export interface FlowPreferences {
  optimizeFor?: "individual" | "team" | "balanced";
  preferredWorkStyle?: "deep" | "burst";
}

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
  estimatedDuration?: number; // Renamed from estimated_duration
}

export interface TaskRoutingConfig {
  flowState: FlowState;
  preferences: Record<string, any>; 
  currentTasks: Task[];
  teamContext?: {
    activeMemberCount: number;
    averageFlowScore: number;
    syncInProgress: boolean;
  };
}

export interface TaskDurationEstimate {
  min: number; // in minutes
  max: number; // in minutes
  confidence: number; // 0-1
}

// Re-defined TaskFlowMetrics interface (duplicate removed if intended)
// export interface TaskFlowMetrics { 
//   estimatedDuration: TaskDurationEstimate; 
//   complexity: number; // 0-100
//   flowAlignment: number; // 0-1
//   contextSwitchCost: number; // 0-1
//   teamImpact: number; // 0-1
// }

export interface TaskRoutingOptions {
  optimizeFor?: "individual" | "team" | "balanced";
  minFlowScore?: number;
  maxDuration?: number;
  priorityWeight?: number;
  deadlineWeight?: number;
  complexityWeight?: number;
  contextWeight?: number;
}

// Extended Task interface with flow-specific properties
export interface FlowTask extends Task {
  flowMetrics?: TaskFlowMetrics; // Check if this TaskFlowMetrics is the intended one
  routingScore?: number;
  previousContext?: string[];
  nextContext?: string[];
  // estimatedDuration is already in Task
}
