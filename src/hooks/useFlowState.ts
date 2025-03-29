import { useState, useCallback, useEffect } from "react";
// Ensure all necessary types are imported
import { FlowState, ActivityMetrics, SessionSummary } from "../types/flow";
import { FlowSessionService } from "../services/FlowSessionService";
import { FlowCalculator } from "../services/flowCalculator";
import {
  getDayProgress,
  calculateCurrentMetrics,
  startMetricsTracking,
  stopMetricsTracking,
} from "../utils/metricsUtils";

export function useFlowState() {
  // Initialize FlowState with 'rest' status
  const [flowState, setFlowState] = useState<FlowState>({
    score: 0,
    status: "rest",
    activeTime: 0,
    interruptions: 0,
    taskCompletions: 0,
  });

  // Initialize ActivityMetrics, including interruptions and interruptedTime
  const [metrics, setMetrics] = useState<ActivityMetrics>({
    activeTime: 0,
    interruptions: 0,
    taskCompletions: 0,
    contextSwitches: 0,
    interruptedTime: 0,
    dayProgress: getDayProgress(),
    lastBreakTime: undefined,
  });

  // Keep track of session start time locally within the hook if needed for summary
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  const startFlowSession = useCallback(async () => {
    try {
      const sessionInfo = await FlowSessionService.start();
      setFlowState(sessionInfo.initialState);
      setSessionStartTime(Date.now()); // Record start time locally
      startMetricsTracking();
    } catch (error) {
      console.error("Failed to start flow session:", error);
      // Optionally set an error state
    }
  }, []);

  const endFlowSession = useCallback(async () => {
    try {
      // Retrieve session info from localStorage to get ID and potentially start time
      const sessionDataString = localStorage.getItem("activeFlowSession"); // Use hardcoded key
      const sessionData = sessionDataString
        ? JSON.parse(sessionDataString)
        : {};
      const sessionId = sessionData?.id || "unknown-session";

      // Construct summary. Use locally tracked startTime or fallback
      const startTimeForSummary = sessionStartTime
        ? new Date(sessionStartTime)
        : new Date(sessionData?.startTime || Date.now());
      const summary: SessionSummary = {
        startTime: startTimeForSummary,
        transitions: [], // Placeholder: This needs actual transition data tracked during the session
        taskCompletions: flowState.taskCompletions,
      };

      await FlowSessionService.end(sessionId, summary);

      setFlowState((prev) => ({ ...prev, status: "rest" })); // Set to 'rest' after ending
      setSessionStartTime(null); // Clear local start time
      stopMetricsTracking();
    } catch (error) {
      console.error("Failed to end flow session:", error);
      // Even if ending fails, update local state to reflect inactive status
      setFlowState((prev) => ({ ...prev, status: "rest" }));
      setSessionStartTime(null);
      stopMetricsTracking();
    }
  }, [flowState.taskCompletions, sessionStartTime]); // Add sessionStartTime to dependency array

  const recordInterruption = useCallback(
    async (type: string, recoveryTime: number) => {
      try {
        const updatedState = await FlowSessionService.recordInterruption(
          type,
          recoveryTime
        );
        setFlowState(updatedState);
        // Update metrics locally based on the interruption
        // Note: recordInterruption service method currently updates localStorage mock state,
        // but ideally it should only update DB, and this hook updates its local state.
        // For now, we also update metrics locally.
        setMetrics((prev) => ({
          ...prev,
          interruptions: prev.interruptions + 1,
          // Assuming recoveryTime is in milliseconds, convert to minutes for interruptedTime?
          interruptedTime: prev.interruptedTime + recoveryTime / 60000,
        }));
      } catch (error) {
        console.error("Failed to record interruption:", error);
      }
    },
    []
  );

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (flowState.status !== "rest") {
      // Check against 'rest' instead of 'inactive'
      intervalId = setInterval(() => {
        // Use functional update for setMetrics to ensure we use the latest metrics state
        setMetrics((prevMetrics) => {
          const updatedMetrics = calculateCurrentMetrics(prevMetrics);

          const newScore = FlowCalculator.calculateFlowScore(updatedMetrics);
          const newStatus = FlowCalculator.determineFlowStatus(
            newScore,
            updatedMetrics
          );

          // Also use functional update for setFlowState
          setFlowState((prevFlowState) => ({
            ...prevFlowState,
            score: newScore,
            status: newStatus,
            activeTime: updatedMetrics.activeTime,
          }));

          return updatedMetrics; // Return the updated metrics for the state
        });
      }, 60000); // Update every minute
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId); // Clear interval on cleanup or status change to 'rest'
      }
    };
  }, [flowState.status]); // Rerun effect when status changes

  return {
    flowState,
    metrics,
    startFlowSession,
    endFlowSession,
    recordInterruption,
  };
}
