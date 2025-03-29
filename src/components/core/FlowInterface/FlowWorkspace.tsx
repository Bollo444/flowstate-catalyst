// src/components/core/FlowInterface/FlowWorkspace.tsx
import React from "react";
import { motion } from "framer-motion";
import { useFlowStore } from "../../../stores/flowStore";
import styles from "./FlowWorkspace.module.css";

interface FlowWorkspaceProps {
  children: React.ReactNode;
}

const FlowWorkspace: React.FC<FlowWorkspaceProps> = ({ children }) => {
  const { currentFlow } = useFlowStore();

  return (
    <motion.div
      className={`${styles.flowWorkspace} ${styles[currentFlow.status]}`}
      animate={{
        scale: currentFlow.status === "optimal" ? [1, 1.002, 1] : 1,
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
};

export default FlowWorkspace;
