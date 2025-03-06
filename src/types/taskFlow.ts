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