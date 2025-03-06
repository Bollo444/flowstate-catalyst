import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { TeamMemberStatus } from '../types/database';

export interface TeamDataResult {
  teamMembers: TeamMemberStatus[];
  loading: boolean;
  error: Error | null;
}

export const useTeamData = (userId: string): TeamDataResult => {
  const [result, setResult] = useState<TeamDataResult>({
    teamMembers: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        // Get user's team ID first
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('team_id')
          .eq('id', userId)
          .single();

        if (userError) throw userError;
        if (!userData?.team_id) {
          setResult({
            teamMembers: [],
            loading: false,
            error: null
          });
          return;
        }

        // Get team member statuses
        const { data: teamMembers, error: teamError } = await supabase
          .from('team_member_status')
          .select(`
            *,
            user:users (
              id,
              email,
              full_name,
              avatar_url
            )
          `)
          .eq('team_id', userData.team_id);

        if (teamError) throw teamError;

        setResult({
          teamMembers: teamMembers as TeamMemberStatus[],
          loading: false,
          error: null
        });
      } catch (error) {
        setResult(prev => ({
          ...prev,
          loading: false,
          error: error as Error
        }));
      }
    };

    if (userId) {
      fetchTeamData();
    } else {
      setResult({
        teamMembers: [],
        loading: false,
        error: null
      });
    }

    // Subscribe to real-time updates
    const teamStatusSubscription = supabase
      .channel('team-status-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_member_status'
        },
        () => {
          // Refresh team data when status changes
          fetchTeamData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(teamStatusSubscription);
    };
  }, [userId]);

  return result;
};