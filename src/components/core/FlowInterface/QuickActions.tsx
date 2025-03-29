// src/components/core/FlowInterface/QuickActions.tsx
import React from "react";
import styles from "./styles.module.css";
import { motion } from "framer-motion";
import { useFlowStore } from "../../store/flowState";
import TeamSyncButton from "../TeamSyncButton"; // Assuming TeamSyncButton exists

interface QuickActionsProps {}

export const QuickActions: React.FC<QuickActionsProps> = () => {
  const { startFlowSession, toggleFocusMode } = useFlowStore();

  return (
    <div className={styles.quickActions}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startFlowSession}
        className={styles.flowButton}
      >
        Start Flow Session ⚡
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleFocusMode}
        className={styles.focusButton}
      >
        Focus Mode 🎯
      </motion.button>

      <TeamSyncButton />
    </div>
  );
};

export default QuickActions;
