import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { TaskRouter, TaskRoutingResult } from '../features/taskFlow/TaskRouter';
import { useTaskFlow } from './useTaskFlow';
import { Task, TeamMemberStatus } from '../types/database';

export interface TaskRoutingState {
  routingResult: TaskRoutingResult | null;
  currentSequence: Task[];
  isRouting: boolean;
  lastUpdate: string | null;
  error: Error | null;
}

export interface UseTaskRouterOptions {
  autoRoute?: boolean;
  sessionDuration?: number;
  minFlowScore?: number;
  onRouteChange?: (result: TaskRoutingResult) => void;
}

export const useTaskRouter = (
  userFlowState: TeamMemberStatus,
  options: UseTaskRouterOptions = {}
) => {
  const user = useUser();
  const { pendingTasks, flowOptimizedTasks, updateTaskProgress } = useTaskFlow(user?.id || '');
  const [router] = useState(() => new TaskRouter(userFlowState));
  const [state, setState] = useState<TaskRoutingState>({
    routingResult: null,
    currentSequence: [],
    isRouting: false,
    lastUpdate: null,
    error: null
  });

  const {
    autoRoute = true,
    sessionDuration = 90,
    minFlowScore = 70,
    onRouteChange
  } = options;

  // Route tasks based on current conditions
  const routeTasks = useCallback(async (
    tasks: Task[],
    currentTaskId?: string,
    duration: number = sessionDuration
  ) => {
    setState(prev => ({ ...prev, isRouting: true }));
    try {
      const result = router.routeTasks(tasks, currentTaskId, duration);
      setState(prev => ({
        ...prev,
        routingResult: result,
        currentSequence: result.suggestedTasks,
        lastUpdate: new Date().toISOString(),
        isRouting: false,
        error: null
      }));
      onRouteChange?.(result);
      return result;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error,
        isRouting: false
      }));
      throw error;
    }
  }, [router, sessionDuration, onRouteChange]);

  // Start task from current sequence
  const startNextTask = useCallback(async () => {
    if (!state.currentSequence.length) return null;

    const nextTask = state.currentSequence[0];
    try {
      await updateTaskProgress(nextTask.id, 
        nextTask.progress === 0 ? 5 : nextTask.progress);
      
      // Re-route remaining tasks
      const remainingTasks = state.currentSequence.slice(1);
      await routeTasks(remainingTasks, nextTask.id);
      
      return nextTask;
    } catch (error) {
      console.error('Failed to start next task:', error);
      throw error;
    }
  }, [state.currentSequence, updateTaskProgress, routeTasks]);

  // Skip current task
  const skipTask = useCallback(async () => {
    if (!state.currentSequence.length) return;

    const remainingTasks = state.currentSequence.slice(1);
    await routeTasks(remainingTasks);
  }, [state.currentSequence, routeTasks]);

  // Reorder tasks manually
  const reorderTasks = useCallback(async (taskIds: string[]) => {
    const reorderedTasks = taskIds
      .map(id => state.currentSequence.find(t => t.id === id))
      .filter((task): task is Task => !!task);

    setState(prev => ({
      ...prev,
      currentSequence: reorderedTasks
    }));
  }, [state.currentSequence]);

  // Auto-route tasks when flow state or tasks change
  useEffect(() => {
    if (!autoRoute || !pendingTasks.length) return;

    const shouldRoute = (
      !state.routingResult ||
      userFlowState.flowState.score >= minFlowScore ||
      !state.lastUpdate ||
      new Date().getTime() - new Date(state.lastUpdate).getTime() > 30 * 60 * 1000 // Re-route every 30 minutes
    );

    if (shouldRoute) {
      routeTasks(pendingTasks);
    }
  }, [
    autoRoute,
    pendingTasks,
    userFlowState,
    minFlowScore,
    state.routingResult,
    state.lastUpdate,
    routeTasks
  ]);

  // Get optimal time slots for tasks
  const getOptimalTimeSlots = useCallback((
    tasks: Task[],
    preferredDuration: number = 60
  ): { task: Task; startHour: number; score: number }[] => {
    const slots: { task: Task; startHour: number; score: number }[] = [];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    tasks.forEach(task => {
      const bestHour = hours.reduce((best, hour) => {
        const isPreferredHour = userFlowState.focusPreferences?.preferredFocusHours.includes(hour);
        const score = isPreferredHour ? 1 : 0.5;
        return score > best.score ? { hour, score } : best;
      }, { hour: 0, score: 0 });

      slots.push({
        task,
        startHour: bestHour.hour,
        score: bestHour.score
      });
    });

    return slots.sort((a, b) => b.score - a.score);
  }, [userFlowState]);

  return {
    ...state,
    routeTasks,
    startNextTask,
    skipTask,
    reorderTasks,
    getOptimalTimeSlots,
    availableTasks: pendingTasks,
    optimizedTasks: flowOptimizedTasks
  };
};