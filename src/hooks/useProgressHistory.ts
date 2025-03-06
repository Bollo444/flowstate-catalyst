import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { ProgressUpdate } from '../types/database';
import { handleSupabaseError } from '../utils/errorHandling';

export interface ProgressHistoryFilters {
  startDate?: string;
  endDate?: string;
  minProgress?: number;
  maxProgress?: number;
}

export const useProgressHistory = (taskId: string) => {
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [history, setHistory] = useState<ProgressUpdate[]>([]);

  const fetchHistory = async (filters?: ProgressHistoryFilters) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('progress_updates')
        .select(`
          *,
          user:users(id, full_name, email, avatar_url)
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters) {
        if (filters.startDate) {
          query = query.gte('created_at', filters.startDate);
        }
        if (filters.endDate) {
          query = query.lte('created_at', filters.endDate);
        }
        if (filters.minProgress) {
          query = query.gte('progress', filters.minProgress);
        }
        if (filters.maxProgress) {
          query = query.lte('progress', filters.maxProgress);
        }
      }

      const { data, error } = await query;

      if (error) {
        throw handleSupabaseError(error);
      }

      setHistory(data as ProgressUpdate[]);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to fetch progress history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [taskId]);

  const addProgressUpdate = async (update: Omit<ProgressUpdate, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('progress_updates')
        .insert(update)
        .select()
        .single();

      if (error) {
        throw handleSupabaseError(error);
      }

      // Update local state with new entry
      setHistory(prev => [data as ProgressUpdate, ...prev]);

      return data;
    } catch (err) {
      console.error('Failed to add progress update:', err);
      throw err;
    }
  };

  const deleteProgressUpdate = async (updateId: string) => {
    try {
      const { error } = await supabase
        .from('progress_updates')
        .delete()
        .eq('id', updateId);

      if (error) {
        throw handleSupabaseError(error);
      }

      // Update local state
      setHistory(prev => prev.filter(update => update.id !== updateId));
    } catch (err) {
      console.error('Failed to delete progress update:', err);
      throw err;
    }
  };

  return {
    history,
    loading,
    error,
    fetchHistory,
    addProgressUpdate,
    deleteProgressUpdate,
    refresh: () => fetchHistory(),
  };
};