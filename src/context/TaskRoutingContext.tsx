'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { Task } from '../types/database';
import type { TeamMemberStatus, FlowState, FlowStateStatus } from '../types/flow';
import type { AppError } from '../types/error';

interface RoutingFactors {
  flowAlignment: number;
  timingOptimality: number;
  workloadBalance: number;
  contextContinuity: number;
  taskScores: Record<string, number>;
}

interface RoutingResult {
  suggestedSequence: Task[];
  routingFactors: RoutingFactors;
  recommendations: string[];
  metadata: {
    routingTimestamp: string;
    flowScore: number;
    sequenceScore: number;
  };
}

interface TaskRoutingOptions {
  autoRoute?: boolean;
  sessionDuration?: number;
  minFlowScore?: number;
  onRouteChange?: (result: RoutingResult) => void;
}

interface TaskRoutingContextType {
  currentSequence: Task[];
  routingResult: RoutingResult | null;
  isRouting: boolean;
  memberStatus: TeamMemberStatus | null;
  error: AppError | null;
  startNextTask: () => void;
  routeTasks: (tasks: Task[]) => void;
  setError: (error: AppError | null) => void;
}

const TaskRoutingContext = createContext<TaskRoutingContextType | undefined>(undefined);

export interface TaskRoutingProviderProps {
  children: React.ReactNode;
  options?: TaskRoutingOptions;
}

export function TaskRoutingProvider({ children, options = {} }: TaskRoutingProviderProps) {
  const [currentSequence, setCurrentSequence] = useState<Task[]>([]);
  const [routingResult, setRoutingResult] = useState<RoutingResult | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [memberStatus, setMemberStatus] = useState<TeamMemberStatus | null>({
    user_id: 'current-user',
    user: {
      id: 'current-user',
      name: 'Current User',
      avatar_url: null
    },
    status: 'flowing' as FlowStateStatus,
    flowState: {
      score: 85,
      intensity: 85,
      status: 'flowing' as FlowStateStatus,
      focus_duration: 1800,
      interruption_count: 0,
      session_start: new Date().toISOString()
    },
    focusPreferences: {
      preferred_hours: {
        start: '09:00',
        end: '17:00'
      },
      minimum_focus_block: 25,
      maximum_flow_duration: 90,
      notification_preferences: ['critical', 'team']
    },
    last_activity: new Date().toISOString()
  });

  const startNextTask = useCallback(() => {
    if (currentSequence.length > 0) {
      const [current, ...remaining] = currentSequence;
      setCurrentSequence(remaining);
      // Add any additional logic for starting a task
    }
  }, [currentSequence]);

  const routeTasks = useCallback(async (tasks: Task[]) => {
    setIsRouting(true);
    setError(null);

    try {
      // Simulate task routing calculation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRoutingResult: RoutingResult = {
        suggestedSequence: tasks,
        routingFactors: {
          flowAlignment: 0.85,
          timingOptimality: 0.9,
          workloadBalance: 0.8,
          contextContinuity: 0.75,
          taskScores: tasks.reduce((acc, task) => ({
            ...acc,
            [task.id]: Math.random() * 0.5 + 0.5
          }), {})
        },
        recommendations: ['Focus on high priority tasks first'],
        metadata: {
          routingTimestamp: new Date().toISOString(),
          flowScore: memberStatus?.flowState.score || 0,
          sequenceScore: 0.85
        }
      };

      setCurrentSequence(tasks);
      setRoutingResult(newRoutingResult);
      
      options.onRouteChange?.(newRoutingResult);
    } catch (err) {
      setError({
        code: 'ROUTING_ERROR',
        message: 'Failed to route tasks',
        details: err instanceof Error ? err : new Error('Unknown error')
      });
    } finally {
      setIsRouting(false);
    }
  }, [memberStatus?.flowState.score, options]);

  return (
    <TaskRoutingContext.Provider
      value={{
        currentSequence,
        routingResult,
        isRouting,
        memberStatus,
        error,
        startNextTask,
        routeTasks,
        setError
      }}
    >
      {children}
    </TaskRoutingContext.Provider>
  );
}

export function useTaskRouting() {
  const context = useContext(TaskRoutingContext);
  if (context === undefined) {
    throw new Error('useTaskRouting must be used within a TaskRoutingProvider');
  }
  return context;
}