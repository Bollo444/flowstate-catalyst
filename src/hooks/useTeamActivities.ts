// src/hooks/useTeamActivities.ts
import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { TeamService } from '../services/api/teamService';
import { useLoadingState } from './useLoadingState';

export const useTeamActivities = (teamId: string) => {
  const supabase = useSupabaseClient();
  const teamService = new TeamService({ supabase });
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { startLoading, stopLoading } = useLoadingState();


  const fetchActivities = async () => {
    try {
      startLoading();
      const data = await teamService.getTeamActivities(teamId);
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchActivities();

    const subscription = supabase
      .channel('team_activities')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'team_activities',
        filter: `team_id=eq.${teamId}`
      }, payload => {
        setActivities(current => [payload.new, ...current]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [teamId]);

  return { activities, loading, refetch: fetchActivities };
};