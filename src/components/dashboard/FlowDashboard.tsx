// src/components/dashboard/FlowDashboard.tsx
import React, { useState, useEffect, useCallback } from "react";
import { FlowScore } from "../flow/FlowScore"; // Assuming placeholder
import ActiveTasks from "../core/ActiveTasks"; // Assuming placeholder
import TeamSync from "../team/TeamSync"; // Assuming placeholder
import styles from "./FlowDashboard.module.css";
import { FlowStateIndicator } from "../flow/FlowStateIndicator";
import QuickActions from "./QuickActions"; // Assuming placeholder
// Import necessary hooks & types
import { useFlowState } from "@/hooks/useFlowState"; // Returns TypesFlowState + metrics + actions
import {
  useFlowContext,
  FlowState as ContextFlowState, // Import context hook and its FlowState
} from "@/context/FlowContext";
import { useFlowMetrics } from "@/hooks/useFlowMetrics";
import { supabase } from "@/lib/supabaseClient";
import { ActivityMetrics } from "@/types/flow"; // For indicator's metrics prop type

// Placeholder components
const PerformanceMetrics: React.FC<{ data: any }> = ({ data }) => (
  <div>Performance Metrics Placeholder: {JSON.stringify(data)}</div>
);
const TaskOverview: React.FC = () => <div>Task Overview Placeholder</div>;

export const FlowDashboard: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const placeholderTimeRange = "week"; // TODO: Implement dynamic time range later

  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user:", error);
          setUserId(null);
        } else {
          setUserId(user?.id ?? null);
        }
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  // Get metrics and interruption action from the useFlowState hook
  // Rename flowState from hook to avoid conflict
  const { metrics: hookMetrics, recordInterruption } = useFlowState();
  // Get the detailed flow state from context for the indicator
  const { flowState: contextFlowState } = useFlowContext(); // This is ContextFlowState

  // Define handleInterrupt using recordInterruption from the hook
  const handleInterrupt = useCallback(() => {
    console.log("Interrupt recorded from FlowDashboard via FlowStateIndicator");
    // Assuming default interruption type and recovery time for now
    recordInterruption("manual", 0);
  }, [recordInterruption]);

  // Use useFlowMetrics hook for fetching historical/aggregated metrics
  const { metrics: fetchedMetrics, isLoading: metricsLoading } = useFlowMetrics(
    userId ?? "",
    placeholderTimeRange
  );

  // Loading/Error states
  if (loadingUser || !contextFlowState) {
    // Check context state is loaded
    return <div>Loading user data...</div>;
  }

  if (!userId) {
    return <div>Error: User not found or not logged in.</div>;
  }

  // Prepare metrics for the indicator (must match ActivityMetrics type)
  const indicatorMetrics: ActivityMetrics = {
    activeTime: hookMetrics.activeTime,
    taskCompletions: hookMetrics.taskCompletions,
    contextSwitches: hookMetrics.contextSwitches,
    dayProgress: hookMetrics.dayProgress,
    interruptions: hookMetrics.interruptions,
    interruptedTime: hookMetrics.interruptedTime,
    lastBreakTime: hookMetrics.lastBreakTime,
  };

  return (
    <div className={styles.flowDashboardContainer}>
      {/* Pass the detailed flowState from context */}
      {/* Pass the calculated metrics */}
      {/* Pass the interruption handler */}
      <FlowStateIndicator
        flowState={contextFlowState} // Use context state here
        metrics={indicatorMetrics} // Pass constructed metrics
        onInterrupt={handleInterrupt} // Pass handler
      />
      {/* Pass the aggregated metrics from useFlowMetrics hook */}
      {metricsLoading && <div>Loading metrics...</div>}
      {!metricsLoading && (
        <PerformanceMetrics data={fetchedMetrics} />
      )}{" "}
      {/* Corrected JSX wrapping */}
      <TaskOverview />
      <TeamSync />
      {/* Maybe include ActiveTasks, FlowScore, QuickActions here if needed */}
    </div>
  );
};
export default FlowDashboard;
