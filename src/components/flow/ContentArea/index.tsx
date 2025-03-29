import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ContentArea.module.css";
import { useFlowStore } from "../../../stores/flowStore";
import { FlowDashboard } from "../FlowDashboard";
import { TeamView } from "../TeamView";

const flowAnimations = {
  pageTransition: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 },
  },
};

export const ContentArea: React.FC = () => {
  const { activeView, isLoading } = useFlowStore();

  if (isLoading) {
    return (
      <div className={styles.contentArea}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.loader}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.contentArea}>
      <AnimatePresence mode="wait">
        {activeView === "dashboard" && (
          <motion.div key="dashboard" {...flowAnimations.pageTransition}>
            <FlowDashboard />
          </motion.div>
        )}

        {activeView === "team" && (
          <motion.div key="team" {...flowAnimations.pageTransition}>
            <TeamView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
