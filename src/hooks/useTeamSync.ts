import { useState, useEffect, useCallback } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { User, FlowSession } from "../types/database";
import { handleSupabaseError } from "../utils/errorHandling";

export interface TeamMemberStatus {
  id: string;
  user: User;
  status: "available" | "focusing" | "busy" | "away";
  flowState: {
    score: number;
    intensity: number;
    sessionStart?: string;
    status:
      | "inactive"
      | "starting"
      | "flowing"
      | "interrupted"
      | "cooling_down";
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
  status: "scheduled" | "active" | "completed" | "cancelled";
  focusScore: number;
  notes?: string[];
}

export function useTeamSync(teamId: string) {
  const [syncState, setSyncState] = useState<FlowSyncState | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const teamFlowSync = useMemo(() => new TeamFlowSync(teamId), [teamId]);

  const initializeSync = useCallback(async () => {
    await teamFlowSync.initialize();
    setIsConnected(true);
  }, [teamFlowSync]);

  const broadcastUpdate = useCallback(
    async (update: FlowUpdate) => {
      await teamFlowSync.broadcastFlowUpdate(update);
    },
    [teamFlowSync]
  );

  const joinSession = useCallback(
    async (sessionId: string) => {
      const session = await teamFlowSync.joinSession(sessionId);
      setSyncState((prev) => ({
        ...prev,
        activeSession: session,
      }));
    },
    [teamFlowSync]
  );

  useEffect(() => {
    initializeSync();

    const unsubscribe = teamFlowSync.onStateChange((newState) => {
      setSyncState(newState);
      setTeamMembers(Array.from(newState.members.values()));
    });

    return () => {
      unsubscribe();
      teamFlowSync.cleanup();
    };
  }, [teamFlowSync, initializeSync]);

  return {
    syncState,
    teamMembers,
    isConnected,
    broadcastUpdate,
    joinSession,
  };
}
