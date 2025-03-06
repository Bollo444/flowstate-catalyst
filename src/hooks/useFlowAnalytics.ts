import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useFlowTasks } from './useFlowTasks';
import { Task } from '@/services/taskFlow';
import {
  AnalyticsMetrics,
  FlowHistoryEntry,
  TaskHistoryEntry,
  TimeRangeOption,
  TaskCompletionDataPoint
} from '@/types/analytics';

interface UseFlowAnalyticsProps {
  userId: string;
  teamId?: string;
  timeRange?: TimeRangeOption;
}

export function useFlowAnalytics({ userId, teamId, timeRange = 'week' }: UseFlowAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const { tasks } = useFlowTasks({ userId, teamId });

  const fetchFlowHistory = async (): Promise<FlowHistoryEntry[]> => {
    try {
      const { data, error } = await supabase
        .from('flow_states')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as FlowHistoryEntry[];
    } catch (err) {
      console.error('Error fetching flow history:', err);
      return [];
    }
  };

  const fetchTaskHistory = async (): Promise<TaskHistoryEntry[]> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
        .order('completed_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching task history:', err);
      return [];
    }
  };

  // Process analytics data
  const processAnalytics = async () => {
    try {
      setLoading(true);
      const [flowHistory, taskHistory] = await Promise.all([
        fetchFlowHistory(),
        fetchTaskHistory()
      ]);

      const flowScoreHistory = flowHistory.map(state => ({
        time: new Date(state.created_at).toLocaleTimeString(),
        score: state.score
      }));

      const taskCompletion = taskHistory.reduce<TaskCompletionDataPoint[]>((acc, task) => {
        const day = new Date(task.completed_at).toLocaleDateString('en-US', { weekday: 'short' });
        const isOptimal = task.flow_optimal;
        
        const existing = acc.find(d => d.day === day);
        if (existing) {
          existing.completed++;
          if (isOptimal) existing.optimal++;
        } else {
          acc.push({ day, completed: 1, optimal: isOptimal ? 1 : 0 });
        }
        
        return acc;
      }, [] as AnalyticsMetrics['taskCompletion']);

      // Calculate averages
      const averageMetrics = {
        flowScore: flowHistory.reduce((acc, state) => acc + state.score, 0) / flowHistory.length,
        activeTime: flowHistory.reduce((acc, state) => acc + state.active_time, 0) / flowHistory.length,
        contextSwitches: taskHistory.filter(t => t.context_cost > 0.3).length,
        taskCompletions: taskHistory.length
      };

      // Calculate trends (percentage change)
      const calculateTrend = (current: number, previous: number) => 
        ((current - previous) / previous) * 100;

      const midPoint = Math.floor(flowHistory.length / 2);
      const trends = {
        flowScore: calculateTrend(
          averageMetrics.flowScore,
          flowHistory.slice(midPoint).reduce((acc, state) => acc + state.score, 0) / midPoint
        ),
        taskCompletion: calculateTrend(
          taskHistory.slice(0, midPoint).length,
          taskHistory.slice(midPoint).length
        ),
        contextSwitching: calculateTrend(
          taskHistory.slice(0, midPoint).filter(t => t.context_cost > 0.3).length,
          taskHistory.slice(midPoint).filter(t => t.context_cost > 0.3).length
        ),
        activeTime: calculateTrend(
          averageMetrics.activeTime,
          flowHistory.slice(midPoint).reduce((acc, state) => acc + state.active_time, 0) / midPoint
        )
      };

      setMetrics({
        flowScoreHistory,
        taskCompletion,
        averageMetrics,
        trends
      });
      
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    processAnalytics();

    // Subscribe to real-time updates
    const flowSubscription = supabase
      .channel('flow_states')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'flow_states',
        filter: `user_id=eq.${userId}`
      }, () => {
        processAnalytics();
      })
      .subscribe();

    const taskSubscription = supabase
      .channel('tasks')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${userId}`
      }, () => {
        processAnalytics();
      })
      .subscribe();

    return () => {
      flowSubscription.unsubscribe();
      taskSubscription.unsubscribe();
    };
  }, [userId, timeRange]);

  return {
    loading,
    error,
    metrics,
    refreshAnalytics: processAnalytics
  };
}
