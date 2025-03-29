import { ActivityMetrics } from "../types/flow"; // Assuming ActivityMetrics is defined here

// --- Metrics Tracking State ---
let metricsInterval: NodeJS.Timeout | null = null;
let sessionStartTime: number | null = null;
let activeTimeAccumulator = 0; // Accumulates active time across intervals

// --- Utility Functions ---

/**
 * Calculates the progress through a typical workday (e.g., 9 AM to 5 PM).
 * Returns a value between 0 and 1.
 */
export function getDayProgress(): number {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(9, 0, 0, 0); // Assuming 9 AM start

  const endOfDay = new Date(now);
  endOfDay.setHours(17, 0, 0, 0); // Assuming 5 PM end

  const totalWorkdayMillis = endOfDay.getTime() - startOfDay.getTime();
  const elapsedMillis = now.getTime() - startOfDay.getTime();

  if (totalWorkdayMillis <= 0) return 0; // Avoid division by zero outside work hours

  return Math.max(0, Math.min(1, elapsedMillis / totalWorkdayMillis));
}

/**
 * Simulates calculating updated metrics based on the time elapsed.
 * In a real app, this would likely involve more complex tracking.
 * @param currentMetrics - The current metrics state.
 * @returns Updated ActivityMetrics.
 */
export function calculateCurrentMetrics(
  currentMetrics: ActivityMetrics
): ActivityMetrics {
  console.log("calculateCurrentMetrics called (basic implementation)");
  // Simple increment based on assumed interval (e.g., 1 minute passed)
  const timeIncrementMinutes = 1;

  // Increment active time
  activeTimeAccumulator += timeIncrementMinutes;

  return {
    ...currentMetrics,
    activeTime: activeTimeAccumulator, // Use the accumulator
    dayProgress: getDayProgress(), // Recalculate day progress
    // Other metrics like taskCompletions, contextSwitches would be updated elsewhere
  };
}

/**
 * Starts the periodic tracking of metrics.
 */
export function startMetricsTracking(): void {
  console.log("startMetricsTracking called (basic implementation)");
  if (metricsInterval) {
    clearInterval(metricsInterval); // Clear any existing interval
  }
  sessionStartTime = Date.now();
  activeTimeAccumulator = 0; // Reset accumulator on start

  // In a real scenario, you might set up listeners or more complex timers here.
  // The primary update logic is handled by the interval in useFlowState for now.
  // This function could initialize background tracking if needed.
  console.log("Metrics tracking started.");

  // Example: Setting up an interval if needed outside useFlowState
  // metricsInterval = setInterval(() => {
  //   console.log("Background metrics tick...");
  //   // Perform background tracking tasks if necessary
  // }, 60000);
}

/**
 * Stops the periodic tracking of metrics.
 */
export function stopMetricsTracking(): void {
  console.log("stopMetricsTracking called (basic implementation)");
  if (metricsInterval) {
    clearInterval(metricsInterval);
    metricsInterval = null;
  }
  sessionStartTime = null;
  // Final calculations or saving might happen here or in FlowSessionService.end
  console.log("Metrics tracking stopped.");
}
