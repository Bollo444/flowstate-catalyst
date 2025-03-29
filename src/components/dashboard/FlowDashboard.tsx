// src/components/dashboard/FlowDashboard.tsx

import React, { useState, useEffect } from "react";
import { FlowScore } from "../flow/FlowScore";
import ActiveTasks from "../core/ActiveTasks";
import TeamSync from "../team/TeamSync";
import styles from "./FlowDashboard.module.css";
import FlowStateIndicator from "../flow/FlowStateIndicator"; // Import FlowStateIndicator component
import QuickActions from "./QuickActions"; // Import QuickActions component
import TeamPresence from "../core/FlowInterface/TeamPresence"; // Ensure correct path to TeamPresence
import FlowNavigation from "../core/FlowInterface/FlowNavigation";
import FlowContent from "../core/FlowInterface/FlowContent";
import FlowHeader from "../core/FlowInterface/FlowHeader";
import FlowWorkspace from "../core/FlowInterface/FlowWorkspace";

interface FlowState {
  score: number;
  status: "peak" | "flow" | "rest" | "building";
  activeTime: number;
}

export const FlowDashboard: React.FC = () => {
  const { flowState } = useFlowState();
  const { metrics } = usePerformanceMetrics();

  return (
    <div className="flow-dashboard">
      <FlowStateIndicator state={flowState} />
      <PerformanceMetrics data={metrics} />
      <TaskOverview />
      <TeamSync />
    </div>
  );
};
export default FlowDashboard;
