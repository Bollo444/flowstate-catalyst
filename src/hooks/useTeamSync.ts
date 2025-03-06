import { useState, useEffect, useCallback } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { User, FlowSession } from '../types/database';
import { handleSupabaseError } from '../utils/errorHandling';

export interface TeamMemberStatus {
  id: string;
  user: User;
  status: 'available' | 'focusing' | 'busy' | 'away';
  flowState: {
    score: number;
    intensity: number;
    sessionStart?: string;
    status: 'inactive' | 'starting' | 'flowing' | 'interrupted' | 'cooling_down';
  };
  lastUpdate: string;
  currentActivity?: string;
  nextAvailable?: string;
  focusPreferences?: {
    startTime: string;
    endTime: string;
    timezone: string;
    preferredFocusHours: number[];
    minimumFocusBlock: number;
  };
}

export interface TeamSync {
  id: string;
  teamId: string;
  startTime: string;
  endTime?: string;
  participants: string[];
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  focusScore: number;
  notes?: string[];
}

export const useTeamSync = (teamId: string) => {
  const supabase = useSupabaseClient();
  const [teamMembers, setTeamMembers] = useState<TeamMemberStatus[]>([]);
  const [activeSyncs, setActiveSyncs] = useState<TeamSync[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch and subscribe to team member statuses
  useEffect(() => {
    let statusSubscription: any;

    const subscribeToStatuses = async () => {
      try {
        // Initial fetch
        const { data: members, error: fetchError } = await supabase
          .from('team_member_status')
          .select(`
            id,
            user:users (
              id,
              full_name,
              email,
              avatar_url
            ),
            status,
            flow_state,
            last_update,
            current_activity,
            next_available,
            focus_preferences
          `)
          .eq('team_id', teamId);

        if (fetchError) throw fetchError;
        setTeamMembers(members);

        // Subscribe to changes
        statusSubscription = supabase
          .channel('team-status')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'team_member_status',
              filter: `team_id=eq.${teamId}`
            },
            async (payload) => {
              const { data: user } = await supabase
                .from('users')
                .select('*')
                .eq('id', payload.new.user_id)
                .single();

              const updatedStatus = {
                ...payload.new,
                user
              };

              setTeamMembers(current =>
                current.map(member =>
                  member.id === updatedStatus.id ? updatedStatus : member
                )
              );
            }
          )
          .subscribe();

      } catch (error) {
        console.error('Error setting up team status subscription:', error);
      }
    };

    subscribeToStatuses();

    return () => {
      if (statusSubscription) {
        supabase.removeChannel(statusSubscription);
      }
    };
  }, [teamId, supabase]);

  // Update user's status
  const updateStatus = async (status: Partial<TeamMemberStatus>) => {
    try {
      const { error } = await supabase
        .from('team_member_status')
        .update({
          ...status,
          last_update: new Date().toISOString()
        })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  };

  // Start a team sync session
  const startTeamSync = async (participants: string[]) => {
    try {
      const { data, error } = await supabase
        .from('team_syncs')
        .insert({
          team_id: teamId,
          start_time: new Date().toISOString(),
          participants,
          status: 'active',
          focus_score: 0
        })
        .select()
        .single();

      if (error) throw error;

      // Update participant statuses
      await Promise.all(
        participants.map(userId =>
          updateStatus({
            status: 'focusing',
            currentActivity: 'Team Sync Session',
            flowState: {
              status: 'starting',
              score: 0,
              intensity: 0
            }
          })
        )
      );

      return data;
    } catch (error) {
      console.error('Error starting team sync:', error);
      throw error;
    }
  };

  // End a team sync session
  const endTeamSync = async (syncId: string, finalScore: number) => {
    try {
      const { error } = await supabase
        .from('team_syncs')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed',
          focus_score: finalScore
        })
        .eq('id', syncId);

      if (error) throw error;

      // Reset participant statuses
      const sync = activeSyncs.find(s => s.id === syncId);
      if (sync) {
        await Promise.all(
          sync.participants.map(userId =>
            updateStatus({
              status: 'available',
              currentActivity: undefined,
              flowState: {
                status: 'inactive',
                score: 0,
                intensity: 0
              }
            })
          )
        );
      }
    } catch (error) {
      console.error('Error ending team sync:', error);
      throw error;
    }
  };

  // Check team availability
  const checkTeamAvailability = useCallback((userIds: string[]) => {
    const availableMembers = teamMembers.filter(member =>
      userIds.includes(member.id) && member.status === 'available'
    );

    return {
      available: availableMembers.length === userIds.length,
      availableMembers: availableMembers.map(m => m.user.id),
      busyMembers: teamMembers
        .filter(member => 
          userIds.includes(member.id) && 
          member.status !== 'available'
        )
        .map(m => ({
          userId: m.user.id,
          name: m.user.full_name,
          status: m.status,
          nextAvailable: m.nextAvailable
        }))
    };
  }, [teamMembers]);

  // Get optimal sync times
  const getOptimalSyncTimes = useCallback((userIds: string[]) => {
    const members = teamMembers.filter(m => userIds.includes(m.id));
    const overlappingHours: number[] = [];

    // Find hours that work for all team members
    for (let hour = 0; hour < 24; hour++) {
      const isOptimal = members.every(member =>
        member.focusPreferences?.preferredFocusHours.includes(hour)
      );
      if (isOptimal) {
        overlappingHours.push(hour);
      }
    }

    // Group consecutive hours into time blocks
    const timeBlocks = overlappingHours.reduce((blocks, hour) => {
      const lastBlock = blocks[blocks.length - 1];
      if (lastBlock && lastBlock[lastBlock.length - 1] === hour - 1) {
        lastBlock.push(hour);
      } else {
        blocks.push([hour]);
      }
      return blocks;
    }, [] as number[][]);

    // Format time blocks into readable ranges
    return timeBlocks.map(block => ({
      start: block[0],
      end: block[block.length - 1],
      duration: block.length
    }));
  }, [teamMembers]);

  return {
    teamMembers,
    activeSyncs,
    loading,
    error,
    updateStatus,
    startTeamSync,
    endTeamSync,
    checkTeamAvailability,
    getOptimalSyncTimes
  };
};