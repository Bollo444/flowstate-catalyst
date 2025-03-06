import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Task, ProgressUpdate } from '../types/database';
import { handleSupabaseError } from '../utils/errorHandling';

export interface ProgressAnalytics {
  completionRate: number;
  averageProgress: number;
  progressTrend: {
    date: string;
    progress: number;
  }[];
  progressByUser: {
    userId: string;
    userName: string;
    averageProgress: number;
    tasksCompleted: number;
  }[];
  timeToCompletion: {
    average: number;
    fastest: number;
    slowest: number;
  };
  taskVelocity: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export interface AnalyticsFilters {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  taskType?: string;
}

export const useProgressAnalytics = () => {
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [analytics, setAnalytics] = useState<ProgressAnalytics | null>(null);

  const calculateAnalytics = (
    tasks: Task[],
    updates: ProgressUpdate[],
    filters: AnalyticsFilters
  ): ProgressAnalytics => {
    const now = new Date();
    const startDate = filters.startDate ? new Date(filters.startDate) : new Date(now.setMonth(now.getMonth() - 1));
    const endDate = filters.endDate ? new Date(filters.endDate) : new Date();

    // Filter data by date range
    const filteredTasks = tasks.filter(task => {
      const taskDate = new Date(task.created_at);
      return taskDate >= startDate && taskDate <= endDate;
    });

    const filteredUpdates = updates.filter(update => {
      const updateDate = new Date(update.created_at);
      return updateDate >= startDate && updateDate <= endDate;
    });

    // Calculate completion rate
    const completedTasks = filteredTasks.filter(task => task.status === 'completed');
    const completionRate = (completedTasks.length / filteredTasks.length) * 100 || 0;

    // Calculate average progress
    const totalProgress = filteredTasks.reduce((sum, task) => sum + (task.progress || 0), 0);
    const averageProgress = totalProgress / filteredTasks.length || 0;

    // Calculate progress trend
    const progressByDate = new Map<string, number[]>();
    filteredUpdates.forEach(update => {
      const date = new Date(update.created_at).toISOString().split('T')[0];
      const current = progressByDate.get(date) || [];
      progressByDate.set(date, [...current, update.progress]);
    });

    const progressTrend = Array.from(progressByDate.entries())
      .map(([date, progressValues]) => ({
        date,
        progress: progressValues.reduce((sum, val) => sum + val, 0) / progressValues.length
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate progress by user
    const userProgress = new Map<string, { 
      progress: number[],
      completed: number,
      name: string 
    }>();

    filteredUpdates.forEach(update => {
      const userId = update.user_id;
      const current = userProgress.get(userId) || { 
        progress: [],
        completed: 0,
        name: update.user?.full_name || update.user?.email || 'Unknown User'
      };
      
      current.progress.push(update.progress);
      userProgress.set(userId, current);
    });

    completedTasks.forEach(task => {
      const userId = task.user_id;
      const current = userProgress.get(userId);
      if (current) {
        current.completed += 1;
      }
    });

    const progressByUser = Array.from(userProgress.entries()).map(([userId, data]) => ({
      userId,
      userName: data.name,
      averageProgress: data.progress.reduce((sum, val) => sum + val, 0) / data.progress.length || 0,
      tasksCompleted: data.completed
    }));

    // Calculate time to completion metrics
    const completionTimes = completedTasks
      .map(task => {
        const createDate = new Date(task.created_at).getTime();
        const completeDate = new Date(task.updated_at).getTime();
        return (completeDate - createDate) / (1000 * 60 * 60 * 24); // Days
      })
      .filter(time => time > 0);

    const timeToCompletion = {
      average: completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length || 0,
      fastest: Math.min(...completionTimes) || 0,
      slowest: Math.max(...completionTimes) || 0
    };

    // Calculate task velocity
    const dayMs = 24 * 60 * 60 * 1000;
    const weekMs = dayMs * 7;
    const monthMs = dayMs * 30;
    const now_ts = now.getTime();

    const taskVelocity = {
      daily: completedTasks.filter(task => 
        (now_ts - new Date(task.updated_at).getTime()) <= dayMs
      ).length,
      weekly: completedTasks.filter(task => 
        (now_ts - new Date(task.updated_at).getTime()) <= weekMs
      ).length / 7,
      monthly: completedTasks.filter(task => 
        (now_ts - new Date(task.updated_at).getTime()) <= monthMs
      ).length / 30
    };

    return {
      completionRate,
      averageProgress,
      progressTrend,
      progressByUser,
      timeToCompletion,
      taskVelocity
    };
  };

  const fetchAnalytics = async (filters: AnalyticsFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch tasks
      let tasksQuery = supabase
        .from('tasks')
        .select('*');

      if (filters.projectId) {
        tasksQuery = tasksQuery.eq('project_id', filters.projectId);
      }
      if (filters.userId) {
        tasksQuery = tasksQuery.eq('user_id', filters.userId);
      }

      // Fetch progress updates
      let updatesQuery = supabase
        .from('progress_updates')
        .select(`
          *,
          user:users (id, full_name, email)
        `);

      if (filters.projectId) {
        updatesQuery = updatesQuery.eq('project_id', filters.projectId);
      }
      if (filters.userId) {
        updatesQuery = updatesQuery.eq('user_id', filters.userId);
      }

      const [tasksResult, updatesResult] = await Promise.all([
        tasksQuery,
        updatesQuery
      ]);

      if (tasksResult.error) throw handleSupabaseError(tasksResult.error);
      if (updatesResult.error) throw handleSupabaseError(updatesResult.error);

      const analytics = calculateAnalytics(
        tasksResult.data as Task[],
        updatesResult.data as ProgressUpdate[],
        filters
      );

      setAnalytics(analytics);
      return analytics;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
  };
};
