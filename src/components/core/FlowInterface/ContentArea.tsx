// src/components/core/FlowInterface/ContentArea.tsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import FlowDashboard from "@/components/dashboard/FlowDashboard"; // Use path alias
import { useFlowStore } from "@/stores/flowStore"; // Use path alias

interface ContentAreaProps {
  className?: string;
}

const flowAnimations = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export const ContentArea: React.FC<ContentAreaProps> = ({ className }) => {
  const { activeView } = useFlowStore();

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {activeView === "dashboard" && (
          <motion.div
            key="dashboard"
            variants={flowAnimations}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <FlowDashboard />
          </motion.div>
        )}

        {activeView === "team" && (
          <motion.div
            key="team"
            variants={flowAnimations}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <TeamView />
          </motion.div>
        )}

        {/* Add other views */}
      </AnimatePresence>
    </div>
  );
};

export default ContentArea;
