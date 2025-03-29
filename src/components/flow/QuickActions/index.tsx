import React from "react";
import { motion } from "framer-motion";
import styles from "./QuickActions.module.css";
import { useFlowStore } from "../../../stores/flowStore";
import { TeamSyncButton } from "../TeamSyncButton";

export const QuickActions: React.FC = () => {
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
