import { useState, useEffect, useCallback } from 'react';
import { useTeamSync } from './useTeamSync';
import { TeamCollaboration, CollaborationTimeSlot, FlowOptimization } from '../features/teamSync/TeamCollaboration';
import { TeamMemberStatus, TeamSync } from '../types/database';

export interface CollaborationState {
  optimalTimes: CollaborationTimeSlot[];
  optimizations: FlowOptimization[];
  canCollaborate: boolean;
  isLoading: boolean;
  error: Error | null;
}

export const useTeamCollaboration = (teamId: string, members: TeamMemberStatus[]) => {
  const { activeSyncs } = useTeamSync(teamId);
  const [collaboration] = useState(() => new TeamCollaboration(teamId));
  const [state, setState] = useState<CollaborationState>({
    optimalTimes: [],
    optimizations: [],
    canCollaborate: false,
    isLoading: true,
    error: null
  });

  // Get current active sync session
  const currentSync = activeSyncs?.[0];

  // Calculate optimal collaboration times
  const calculateOptimalTimes = useCallback(async (duration?: number) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const times = await collaboration.calculateOptimalTimes(members, duration);
      setState(prev => ({
        ...prev,
        optimalTimes: times,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error,
        isLoading: false
      }));
    }
  }, [collaboration, members]);

  // Get flow optimization suggestions
  const getOptimizations = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const optimizations = await collaboration.getFlowOptimizations();
      setState(prev => ({
        ...prev,
        optimizations,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error,
        isLoading: false
      }));
    }
  }, [collaboration]);

  // Check if collaboration is currently suitable
  const checkCollaborationSuitability = useCallback(async () => {
    try {
      const canCollaborate = await collaboration.checkCollaborationSuitability(members);
      setState(prev => ({
        ...prev,
        canCollaborate
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error
      }));
    }
  }, [collaboration, members]);

  // Update optimal times when team members change
  useEffect(() => {
    calculateOptimalTimes();
  }, [calculateOptimalTimes]);

  // Update optimizations when sync state changes
  useEffect(() => {
    if (currentSync?.status === 'active') {
      getOptimizations();
    }
  }, [currentSync, getOptimizations]);

  // Regularly check collaboration suitability
  useEffect(() => {
    checkCollaborationSuitability();
    const interval = setInterval(checkCollaborationSuitability, 300000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, [checkCollaborationSuitability]);

  const suggestCollaborationTime = useCallback((preferredDuration: number = 60): CollaborationTimeSlot | null => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Filter times that are still upcoming today or tomorrow
    const validTimes = state.optimalTimes.filter(slot => {
      if (slot.start >= currentHour) return true;
      if (slot.end - slot.start >= preferredDuration / 60) return true;
      return false;
    });

    return validTimes[0] || null;
  }, [state.optimalTimes]);

  const getCollaborationScore = useCallback((members: TeamMemberStatus[]): number => {
    const activeMembers = members.filter(m => m.status === 'focusing');
    if (!activeMembers.length) return 0;

    const avgFlowScore = activeMembers.reduce(
      (sum, m) => sum + m.flowState.score,
      0
    ) / activeMembers.length;

    const participationRate = (activeMembers.length / members.length) * 100;
    
    return Math.round((avgFlowScore + participationRate) / 2);
  }, []);

  return {
    ...state,
    currentSync,
    calculateOptimalTimes,
    getOptimizations,
    checkCollaborationSuitability,
    suggestCollaborationTime,
    getCollaborationScore,
    refresh: async () => {
      await Promise.all([
        calculateOptimalTimes(),
        getOptimizations(),
        checkCollaborationSuitability()
      ]);
    }
  };
};