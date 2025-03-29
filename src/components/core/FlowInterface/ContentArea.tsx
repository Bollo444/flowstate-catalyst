// src/components/core/FlowInterface/ContentArea.tsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion"; // Removed Variants import
import FlowDashboard from "../dashboard/FlowDashboard";
import TeamView from "../team/TeamView";
import { useFlowStore } from "../../stores/flowStore"; // Corrected store path

interface ContentAreaProps {
  className?: string;
}

const flowAnimations = {
  // Removed explicit Variants type annotation
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

        {activeView === "team" && ( // Corrected animation props
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
