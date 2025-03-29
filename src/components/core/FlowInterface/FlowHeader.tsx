// src/components/core/FlowInterface/FlowHeader.tsx
import React from "react";
import styles from "./FlowInterface.module.css";
import FlowStateIndicator from "./FlowStateIndicator";
import QuickActions from "../dashboard/QuickActions";
import TeamPresence from "../team/TeamPresence";

interface FlowHeaderProps {
  children?: React.ReactNode;
}

export const FlowHeader: React.FC<FlowHeaderProps> = ({ children }) => {
  return (
    <header className={styles.dashboardHeader}>
      <FlowStateIndicator />
      <QuickActions />
      <TeamPresence />
      {children}
    </header>
  );
};

export default FlowHeader;
