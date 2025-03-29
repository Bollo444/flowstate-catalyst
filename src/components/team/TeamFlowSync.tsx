"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FlowState } from "@/types/flow";
import { flowSyncService } from "@/services/flowSync";
import styles from "./TeamFlowSync.module.css";

interface TeamMemberFlow extends FlowState {
  name: string;
  avatarUrl?: string;
}

interface TeamFlowSyncProps {
  teamId: string;
  currentUserId: string;
}

const staggerDelay = 0.1;

export const TeamFlowSync: React.FC<TeamFlowSyncProps> = ({
  teamId,
  currentUserId,
}) => {
  const [teamFlows, setTeamFlows] = useState<TeamMemberFlow[]>([]);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    // Subscribe to team flow updates
    const unsubscribeFlow = flowSyncService.onFlowUpdate((state) => {
      setTeamFlows((prev) => {
        const index = prev.findIndex(
          (member) => member.userId === state.userId
        );
        if (index === -1) return prev;

        const updated = [...prev];
        updated[index] = { ...updated[index], ...state };
        return updated;
      });
    });

    // Subscribe to presence updates
    const unsubscribePresence = flowSyncService.onPresenceUpdate(
      (presenceStates) => {
        setTeamFlows((prev) => {
          return prev.map((member) => ({
            ...member,
            online: presenceStates.some(
              (state) => state.userId === member.userId && state.online
            ),
          }));
        });
        setSynced(true);
      }
    );

    return () => {
      unsubscribeFlow();
      unsubscribePresence();
    };
  }, [teamId]);

  const getFlowAdvice = (memberFlow: TeamMemberFlow) => {
    if (memberFlow.status === "peak") {
      return "In deep focus - minimize interruptions";
    } else if (memberFlow.status === "flow") {
      return "Good time for quick collaboration";
    } else if (memberFlow.status === "rest") {
      return "Taking a break";
    }
    return "Building focus";
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h3>Team Flow</h3>
        <div className={styles.syncStatus}>
          {synced ? "Real-time sync active" : "Connecting..."}
        </div>
      </header>

      <AnimatePresence>
        <div className={styles.membersGrid}>
          {teamFlows.map((member, index) => (
            <motion.div
              key={member.userId}
              className={styles.memberCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * staggerDelay }}
            >
              <div className={styles.memberHeader}>
                <Avatar className={styles.avatar}>
                  <AvatarImage src={member.avatarUrl} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div className={styles.memberInfo}>
                  <h4>{member.name}</h4>
                  <div
                    className={`${styles.flowStatus} ${styles[member.status]}`}
                  >
                    {member.status}
                  </div>
                </div>
              </div>

              <div className={styles.flowMetrics}>
                <div className={styles.metric}>
                  <span>Flow Score</span>
                  <motion.div
                    className={styles.score}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {member.score}
                  </motion.div>
                </div>
                <div className={styles.metric}>
                  <span>Active Time</span>
                  <div>{Math.floor(member.activeTime)}m</div>
                </div>
              </div>

              <div className={styles.advice}>{getFlowAdvice(member)}</div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {teamFlows.length === 0 && (
        <div className={styles.empty}>No team members currently active</div>
      )}
    </div>
  );
};

export default TeamFlowSync;
