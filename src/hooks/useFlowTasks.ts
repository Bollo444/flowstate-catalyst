import { useState, useEffect, useCallback } from 'react';
import { useFlowContext } from '@/context/FlowContext';
<<<<<<< HEAD
import { 
  calculateContextSwitch,
  suggestBreak,
  predictTaskSuccess,
  updateTaskFlowMetrics,
  getOptimalTasks,
  deleteTask,
  updateTask,
  createTask
} from '@/services/taskFlow';
import { supabase } from '@/lib/supabaseClient';
import { Task } from '@/types/taskFlow';
import { FlowState } from '@/types/flow'; // ADDED FlowState import
=======
import { TaskFlowService, Task } from '@/services/taskFlow';
import { supabase } from '@/lib/supabaseClient';
>>>>>>> 7d9ee070489d2151403e6b883b553afda5d85c0e

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
<<<<<<< HEAD
        const tasks = await getOptimalTasks(userId, flowState);
=======
        const tasks = await TaskFlowService.getOptimalTasks(userId, flowState);
>>>>>>> 7d9ee070489d2151403e6b883b553afda5d85c0e
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
<<<<<<< HEAD
        const switchCost = calculateContextSwitch(
=======
        const switchCost = TaskFlowService.calculateContextSwitch(
>>>>>>> 7d9ee070489d2151403e6b883b553afda5d85c0e
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
<<<<<<< HEAD
      await updateTaskFlowMetrics(
=======
      await TaskFlowService.updateTaskFlowMetrics(
>>>>>>> 7d9ee070489d2151403e6b883b553afda5d85c0e
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
<<<<<<< HEAD
  const createTask = useCallback(async (task: Omit<Task, 'id'>) => {
=======
  const createTask = useCallback(async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
>>>>>>> 7d9ee070489d2151403e6b883b553afda5d85c0e
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
<<<<<<< HEAD
      console.error('Error creating task:', error);
=======
      console.error('Error creating task:', err);
>>>>>>> 7d9ee070489d2151403e6b883b553afda5d85c0e
      throw err;
    }
  }, [userId, teamId]);

<<<<<<< HEAD
  // Update an existing task
  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  }, []);

  // Delete a task
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  }, []);

=======
>>>>>>> 7d9ee070489d2151403e6b883b553afda5d85c0e
  // Get optimal task suggestions
  const getTaskSuggestions = useCallback(() => {
    return tasks
      .filter(task => !task.completed)
      .map(task => ({
        ...task,
<<<<<<< HEAD
        successProbability: predictTaskSuccess(task, flowState)
=======
        successProbability: TaskFlowService.predictTaskSuccess(task, flowState)
>>>>>>> 7d9ee070489d2151403e6b883b553afda5d85c0e
      }))
      .sort((a, b) => b.successProbability - a.successProbability);
  }, [tasks, flowState]);

  // Check if a break is recommended
  const shouldTakeBreak = useCallback(() => {
<<<<<<< HEAD
    return suggestBreak(flowState);
=======
    return TaskFlowService.suggestBreak(flowState);
>>>>>>> 7d9ee070489d2151403e6b883b553afda5d85c0e
  }, [flowState]);

  return {
    tasks,
    loading,
    error,
    activeTaskId,
    switchTask,
    completeTask,
    createTask,
<<<<<<< HEAD
    updateTask,
    deleteTask, // <--- ADDED deleteTask
=======
>>>>>>> 7d9ee070489d2151403e6b883b553afda5d85c0e
    getTaskSuggestions,
    shouldTakeBreak
  };
}
