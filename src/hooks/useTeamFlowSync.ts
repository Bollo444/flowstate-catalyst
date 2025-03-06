import { useState, useEffect, useCallback } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { TeamFlowSync, FlowSyncState } from '../features/teamSync/TeamFlowSync';
import { TeamMemberStatus } from '../types/database';

export interface UseTeamFlowSyncResult {
  syncState: FlowSyncState | null;
  isInitialized: boolean;
  error: Error | null;
  startSync: (participants: string[]) => Promise<void>;
  endSync: (finalScore: number) => Promise<void>;
  updateParticipantState: (userId: string, state: Partial<TeamMemberStatus>) => Promise<void>;
}

export const useTeamFlowSync = (teamId: string): UseTeamFlowSyncResult => {
  const supabase = useSupabaseClient();
  const [teamSync, setTeamSync] = useState<TeamFlowSync | null>(null);
  const [syncState, setSyncState] = useState<FlowSyncState | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize TeamFlowSync instance
  useEffect(() => {
    const sync = new TeamFlowSync(teamId);
    
    const initialize = async () => {
      try {
        await sync.initialize();
        setTeamSync(sync);
        setIsInitialized(true);
      } catch (err) {
        setError(err as Error);
        console.error('Failed to initialize team sync:', err);
      }
    };

    initialize();

    // Cleanup
    return () => {
      sync.dispose();
    };
  }, [teamId]);

  // Subscribe to sync state updates
  useEffect(() => {
    if (!teamSync) return;

    const unsubscribe = teamSync.subscribe((state) => {
      setSyncState(state);
    });

    return () => {
      unsubscribe();
    };
  }, [teamSync]);

  // Start a new sync session
  const startSync = useCallback(async (participants: string[]) => {
    if (!teamSync) {
      throw new Error('Team sync not initialized');
    }

    try {
      await teamSync.startSync(participants);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [teamSync]);

  // End current sync session
  const endSync = useCallback(async (finalScore: number) => {
    if (!teamSync || !syncState) {
      throw new Error('No active sync session');
    }

    try {
      await teamSync.endSync(syncState.sessionId, finalScore);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [teamSync, syncState]);

  // Update participant state
  const updateParticipantState = useCallback(async (
    userId: string,
    state: Partial<TeamMemberStatus>
  ) => {
    if (!teamSync) {
      throw new Error('Team sync not initialized');
    }

    try {
      await teamSync.updateParticipantState(userId, state);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [teamSync]);

  // Listen for active sync sessions
  useEffect(() => {
    if (!isInitialized) return;

    const channel = supabase
      .channel(`team_syncs:${teamId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_syncs',
          filter: `team_id=eq.${teamId} AND status=eq.active`
        },
        async (payload) => {
          if (payload.eventType === 'INSERT' && teamSync) {
            // Auto-join sync session if current user is a participant
            const currentUser = (await supabase.auth.getUser()).data.user;
            if (
              currentUser &&
              payload.new.participants.includes(currentUser.id) &&
              !syncState
            ) {
              try {
                await teamSync.startSync(payload.new.participants);
              } catch (err) {
                console.error('Failed to join sync session:', err);
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId, isInitialized, teamSync, syncState, supabase]);

  return {
    syncState,
    isInitialized,
    error,
    startSync,
    endSync,
    updateParticipantState
  };
};