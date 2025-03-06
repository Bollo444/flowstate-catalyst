import { Task } from '../../types/database';

export interface TaskRoutingFactors {
  flowAlignment: number;
  timingOptimality: number;
  workloadBalance: number;
  contextContinuity: number;
  taskScores: Record<string, number>;
}

export interface TaskRoutingParams {
  currentTaskId?: string;
  duration?: number;
  preferredStartTime?: Date;
  flowThreshold?: number;
  considerWorkload?: boolean;
}

export interface TaskRoutingResult {
  suggestedSequence: Task[];
  routingFactors: TaskRoutingFactors;
  recommendations: string[];
  metadata: {
    routingTimestamp: string;
    flowScore: number;
    sequenceScore: number;
  };
}

export interface TaskRouterOptions {
  autoRoute?: boolean;
  sessionDuration?: number;
  minFlowScore?: number;
  onRouteChange?: (result: TaskRoutingResult) => void;
}

export enum TaskRoutingStrategy {
  FLOW_OPTIMIZED = 'flow_optimized',
  TIME_SENSITIVE = 'time_sensitive',
  BALANCED = 'balanced',
  CONTEXT_BASED = 'context_based'
}

export interface TaskRoutingMetrics {
  averageFlowAlignment: number;
  taskCompletionRate: number;
  contextSwitches: number;
  flowStatesDuration: number;
}

// Types for task flow events and updates
export type TaskFlowEvent = {
  type: 'task_start' | 'task_complete' | 'task_skip' | 'flow_state_change';
  timestamp: string;
  taskId?: string;
  flowScore?: number;
  metadata?: Record<string, any>;
};

export interface TaskRoutingUpdate {
  newSequence: Task[];
  previousSequence: Task[];
  routingFactors: TaskRoutingFactors;
  reason: string;
  timestamp: string;
}