// src/hooks/useFlowHistory.ts
import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export const useFlowHistory = (userId: string) => {
  const supabase = useSupabaseClient();
  const [flowHistory, setFlowHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFlowHistory = async () => {
      setLoading(true);
      try {
        // Fetch flow history data from Supabase for the given userId
        const { data, error } = await supabase
          .from('flow_metrics')
          .select('*')
          .eq('user_id', userId)
          .order('timestamp', { ascending: true })
          .limit(30); // Limit to last 30 data points for performance

        if (error) throw error;

        setFlowHistory(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlowHistory();
  }, [supabase, userId]);

  return { flowHistory, loading, error };
};

export default useFlowHistory;