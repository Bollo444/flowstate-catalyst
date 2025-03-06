import { useState, useEffect, useCallback } from 'react';
import { useFlowContext } from '@/context/FlowContext';
import { TaskFlowService, Task } from '@/services/taskFlow';
import { supabase } from '@/lib/supabaseClient';

interface UseFlowTasksOptions {
  userId: string;
  teamId?: string;
}

export function useFlowTasks({ userId, teamId }: UseFlowTasksOptions) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const { flowState } = useFlowContext();

  // Fetch tasks and set up real-time subscription
  useEffect(() => {
    let mounted = true;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasks = await TaskFlowService.getOptimalTasks(userId, flowState);
        if (mounted) {
          setTasks(tasks);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };

    // Subscribe to task changes
    const subscription = supabase
      .channel('tasks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: teamId 
            ? `user_id=eq.${userId} OR team_id=eq.${teamId}`
            : `user_id=eq.${userId}`
        },
        async () => {
          // Refetch tasks to get updated priorities
          await fetchTasks();
        }
      )
      .subscribe();

    fetchTasks();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [userId, teamId, flowState]);

  // Switch to a new task
  const switchTask = useCallback(async (taskId: string) => {
    if (activeTaskId === taskId) return;

    try {
      if (activeTaskId) {
        // Record context switch
        const switchCost = TaskFlowService.calculateContextSwitch(
          activeTaskId,
          taskId,
          flowState
        );

        await supabase.from('task_context_switches').insert({
          user_id: userId,
          from_task_id: activeTaskId,
          to_task_id: taskId,
          flow_score: flowState.score,
          active_time: flowState.activeTime,
          switch_cost: switchCost
        });
      }

      setActiveTaskId(taskId);

    } catch (err) {
      console.error('Error switching tasks:', err);
    }
  }, [activeTaskId, flowState, userId]);

  // Complete a task
  const completeTask = useCallback(async (taskId: string) => {
    try {
      // Update task completion metrics
      await TaskFlowService.updateTaskFlowMetrics(
        taskId,
        flowState.activeTime,
        flowState.score
      );

      // Mark task as completed
      await supabase
        .from('tasks')
        .update({ completed: true })
        .eq('id', taskId);

      if (activeTaskId === taskId) {
        setActiveTaskId(null);
      }

    } catch (err) {
      console.error('Error completing task:', err);
    }
  }, [flowState, activeTaskId]);

  // Create a new task
  const createTask = useCallback(async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...task,
          user_id: userId,
          team_id: teamId
        }])
        .select()
        .single();

      if (error) throw error;
      return data;

    } catch (err) {
      console.error('Error creating task:', err);
      throw err;
    }
  }, [userId, teamId]);

  // Get optimal task suggestions
  const getTaskSuggestions = useCallback(() => {
    return tasks
      .filter(task => !task.completed)
      .map(task => ({
        ...task,
        successProbability: TaskFlowService.predictTaskSuccess(task, flowState)
      }))
      .sort((a, b) => b.successProbability - a.successProbability);
  }, [tasks, flowState]);

  // Check if a break is recommended
  const shouldTakeBreak = useCallback(() => {
    return TaskFlowService.suggestBreak(flowState);
  }, [flowState]);

  return {
    tasks,
    loading,
    error,
    activeTaskId,
    switchTask,
    completeTask,
    createTask,
    getTaskSuggestions,
    shouldTakeBreak
  };
}
