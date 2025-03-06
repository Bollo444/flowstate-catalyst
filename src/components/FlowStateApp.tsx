'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlowContext } from '@/context/FlowContext';
import { supabase } from '@/lib/supabaseClient';
import { flowAnimations } from '@/styles/animations';
import { ActivityMetrics } from '@/types/flow';
import { FlowCalculator } from '@/services/flowCalculator';
import { FlowScore } from '@/components/flow/FlowScore';
import { ActiveTasks } from '@/components/core/ActiveTasks';
import { TeamFlowSync } from '@/components/team/TeamFlowSync';
import { useTeam } from '@/hooks/useTeam';
import styles from './FlowStateApp.module.css';

interface FlowStateAppProps {
  initialTeamId?: string;
}

export const FlowStateApp: React.FC<FlowStateAppProps> = ({ initialTeamId }) => {
  const { flowState, updateFlowState } = useFlowContext();
  const { team } = useTeam(flowState.userId);
  const teamId = initialTeamId || team?.id;

  useEffect(() => {
    const initializeFlowState = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const initialMetrics: ActivityMetrics = {
        activeTime: 0,
        taskCompletions: 0,
        contextSwitches: 0,
        dayProgress: new Date().getHours() / 24,
      };

      const initialState = FlowCalculator.createFlowState(user.id, initialMetrics);
      updateFlowState({ 
        ...initialState,
        userId: user.id,
        lastUpdated: new Date().toISOString()
      });
    };

    initializeFlowState();
  }, [updateFlowState]);

  if (!flowState.userId) {
    return null;
  }

  const mockMetrics: ActivityMetrics = {
    activeTime: flowState.activeTime,
    taskCompletions: 0,
    contextSwitches: 0,
    dayProgress: new Date().getHours() / 24,
  };

  return (
    <motion.div 
      className={styles.flowContainer}
      initial="initial"
      animate="animate"
      variants={flowAnimations.enter}
    >
      <AnimatePresence>
        <motion.div 
          className={styles.flowScoreCard}
          animate={flowAnimations.flowPulse}
        >
          <FlowScore 
            score={flowState.score} 
            status={flowState.status}
            metrics={mockMetrics}
            showDetails={true}
          />
        </motion.div>

        {flowState.userId && (
          <motion.div 
            className={styles.taskStream}
            variants={flowAnimations.enter}
          >
            <ActiveTasks 
              userId={flowState.userId}
              teamId={teamId}
            />
          </motion.div>
        )}

        <motion.div 
          className={styles.teamSyncCard}
          animate={flowAnimations.ripple}
        >
          {teamId && (
            <TeamFlowSync 
              teamId={teamId}
              currentUserId={flowState.userId}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
