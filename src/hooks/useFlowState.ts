import { useState, useCallback, useEffect } from "react";
// Import FlowState (alias for FlowState from types/flow) and ActivityMetrics
import {
  FlowState, // Using the type defined in types/flow
  ActivityMetrics,
  SessionSummary,
} from "../types/flow";
import { FlowSessionService } from "../services/FlowSessionService";
import { FlowCalculator } from "../services/flowCalculator";
import {
  getDayProgress,
  calculateCurrentMetrics,
  startMetricsTracking,
  stopMetricsTracking,
} from "../utils/metricsUtils";
import { FlowStatus } from "@/types/database"; // For initial state status typing

// Use the FlowState from types/flow for initial state here
const initialFlowState: FlowState = {
  score: 0,
  status: "rest" as FlowStatus, // Use the enum for type safety
  activeTime: 0,
  interruptions: 0,
  taskCompletions: 0,
};

const initialMetrics: ActivityMetrics = {
  activeTime: 0,
  interruptions: 0,
  taskCompletions: 0,
  contextSwitches: 0,
  interruptedTime: 0,
  dayProgress: getDayProgress(),
  lastBreakTime: undefined,
};

export function useFlowState() {
  const [flowState, setFlowState] = useState<FlowState>(initialFlowState);
  const [metrics, setMetrics] = useState<ActivityMetrics>(initialMetrics);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  // isLoadingUser removed as userId is handled internally by service

  const startFlowSession = useCallback(async () => {
    try {
      // Corrected: Call start without arguments
      const sessionInfo = await FlowSessionService.start();
      setFlowState(sessionInfo.initialState); // Set state directly from service
      setSessionStartTime(Date.now());
      // Reset metrics based on service initial state
      setMetrics({
        ...initialMetrics,
        activeTime: sessionInfo.initialState.activeTime || 0,
        interruptions: sessionInfo.initialState.interruptions || 0,
        taskCompletions: sessionInfo.initialState.taskCompletions || 0,
      });
      startMetricsTracking();
    } catch (error) {
      console.error("Failed to start flow session:", error);
    }
  }, []); // No dependencies needed now

  const endFlowSession = useCallback(async () => {
    try {
      const sessionDataString = localStorage.getItem("activeFlowSession");
      const sessionData = sessionDataString
        ? JSON.parse(sessionDataString)
        : {};
      const sessionId = sessionData?.id || "unknown-session";
      // Note: userId verification might be needed before ending unknown session

      const startTimeForSummary = sessionStartTime
        ? new Date(sessionStartTime)
        : new Date(sessionData?.startTime || Date.now());

      const finalMetrics = calculateCurrentMetrics(metrics); // Get latest metrics

      const summary: SessionSummary = {
        startTime: startTimeForSummary,
        transitions: [], // Placeholder
        taskCompletions: finalMetrics.taskCompletions, // Use final metrics
      };

      await FlowSessionService.end(sessionId, summary);

      setFlowState((prev) => ({ ...prev, status: "rest" })); // Reset status
      setSessionStartTime(null);
      stopMetricsTracking();
    } catch (error) {
      console.error("Failed to end flow session:", error);
      // Reset local state even on failure
      setFlowState((prev) => ({ ...prev, status: "rest" }));
      setSessionStartTime(null);
      stopMetricsTracking();
    }
  }, [sessionStartTime, metrics]);

  const recordInterruption = useCallback(
    async (type: string, recoveryTime: number) => {
      try {
        // Corrected: Call service method without userId
        const updatedStateFromService: FlowState =
          await FlowSessionService.recordInterruption(type, recoveryTime);

        setFlowState(updatedStateFromService); // Update state from service response

        // Update metrics based on the NEW state from service
        setMetrics((prev) => {
          const updatedInterruptedTime =
            prev.interruptedTime + recoveryTime / 60000; // Assuming ms
          const updatedMetrics: ActivityMetrics = {
            ...prev,
            interruptions:
              updatedStateFromService.interruptions ?? prev.interruptions + 1, // Use service value or increment
            interruptedTime: updatedInterruptedTime,
            taskCompletions:
              updatedStateFromService.taskCompletions ?? prev.taskCompletions, // Use value from service response
            activeTime: updatedStateFromService.activeTime ?? prev.activeTime, // Use value from service response
            // Ensure all properties from ActivityMetrics are present
            contextSwitches: prev.contextSwitches, // Keep previous value if not updated
            dayProgress: prev.dayProgress, // Keep previous value
            lastBreakTime: prev.lastBreakTime, // Keep previous value
          };
          return updatedMetrics;
        });
      } catch (error) {
        console.error("Failed to record interruption:", error);
      }
    },
    [] // No direct dependencies needed
  );

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    // Only run interval logic if the session is active
    if (flowState.status !== "rest") {
      intervalId = setInterval(() => {
        setMetrics((prevMetrics) => {
          const updatedMetrics = calculateCurrentMetrics(prevMetrics);
          const newScore = FlowCalculator.calculateFlowScore(updatedMetrics);
          const newStatus = FlowCalculator.determineFlowStatus(
            newScore,
            updatedMetrics
          );

          setFlowState((prevFlowState) => {
            // Update state using the fields available in the imported FlowState type
            if (
              prevFlowState.score !== newScore ||
              prevFlowState.status !== newStatus ||
              prevFlowState.activeTime !== updatedMetrics.activeTime ||
              prevFlowState.interruptions !== updatedMetrics.interruptions || // Check metrics too
              prevFlowState.taskCompletions !== updatedMetrics.taskCompletions
            ) {
              return {
                score: newScore,
                status: newStatus,
                activeTime: updatedMetrics.activeTime,
                interruptions: updatedMetrics.interruptions, // Update state from metrics
                taskCompletions: updatedMetrics.taskCompletions, // Update state from metrics
              };
            }
            return prevFlowState;
          });

          return updatedMetrics;
        });
      }, 60000); // Update every minute
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [flowState.status]); // Rerun effect only when status changes

  return {
    flowState, // This is FlowState from types/flow.ts
    metrics,
    startFlowSession,
    endFlowSession,
    recordInterruption,
  };
}
