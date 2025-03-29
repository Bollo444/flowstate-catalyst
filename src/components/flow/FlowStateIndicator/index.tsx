"use client";

import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlowScore } from "../FlowScore";
import { Timer } from "@/components/shared/Timer";
import { AlertCircle, AlertTriangle, CheckCircle, Zap } from "lucide-react";
import { FlowState } from "@/context/FlowContext"; // *** Use FlowState from context ***
import { ActivityMetrics } from "@/types/flow"; // Keep ActivityMetrics from flow types
import { FlowStatus } from "@/types/database"; // *** Import FlowStatus enum from database types ***
import clsx from "clsx"; // For conditional classes

interface FlowStateIndicatorProps {
  flowState: FlowState;
  metrics: ActivityMetrics;
  onInterrupt: () => void;
}

export const FlowStateIndicator: React.FC<FlowStateIndicatorProps> = ({
  flowState,
  metrics,
  onInterrupt,
}) => {
  const getStateIcon = useCallback(() => {
    const iconClasses = "w-6 h-6"; // Base icon size
    switch (flowState.status) {
      case "peak":
        // Using Zap icon for peak, themed colors
        return <Zap className={clsx(iconClasses, "text-success-light dark:text-success-dark")} />;
      case "flow":
        // Using CheckCircle for flow, themed accent colors
        return <CheckCircle className={clsx(iconClasses, "text-accent-light dark:text-accent-dark")} />;
      case "building":
        // Using AlertTriangle for building, themed warning colors
        return <AlertTriangle className={clsx(iconClasses, "text-warning-light dark:text-warning-dark")} />;
      case "rest":
        // Using AlertCircle for rest, themed error colors
        return <AlertCircle className={clsx(iconClasses, "text-error-light dark:text-error-dark")} />;
      default:
        return null;
    }
  }, [flowState.status]);

  const getStateMessage = useCallback(() => {
    // Cast keys explicitly to FlowStatus to resolve indexing error
    const messages: Record<FlowStatus, string> = {
      peak: "You're in peak flow! Keep going!",
      flow: "You're in a good flow state",
      building: "Building towards flow state",
      rest: "Time for a short break?",
      // Assuming 'inactive' isn't a typical status to display a message for here
      // If it needs one, add: inactive: "Currently inactive"
    };
    // Ensure that flowState.status is a valid key before accessing
    if (flowState.status && messages[flowState.status as FlowStatus]) {
       return messages[flowState.status as FlowStatus];
    }
    return ""; // Default empty message
  }, [flowState.status]);

  // Note: The flowState prop now comes from FlowContext, which lacks taskCompletions/interruptions.
  // The ActivityMetrics type expects them. DashboardLayout provides 0 as defaults for the metrics prop.

  return (
    // Container: Flex layout (responsive), gap, themed background, rounded, shadow
    <motion.div
      className="flex flex-col md:flex-row gap-4 p-4 bg-background-light dark:bg-background-dark-secondary rounded-lg shadow-lg text-foreground-light dark:text-foreground-dark" // Adjusted padding/gap, added base text colors
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Score Section: Apply Tailwind classes directly */}
      <div className="flex-shrink-0 w-full md:w-64">
        <FlowScore
          score={flowState.score}
          // status is available on the context's FlowState
          status={flowState.status}
          metrics={metrics}
          showDetails
        />
      </div>

      {/* Info Section: Flex grow, column layout, gap */}
      <div className="flex-grow flex flex-col gap-3">
        <AnimatePresence mode="wait">
           {/* Status Message: Flex layout, gap, text size/weight */}
          <motion.div
            key={flowState.status} // Animation key based on status
            className="flex items-center gap-3 text-lg font-medium"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {getStateIcon()}
            <span>{getStateMessage()}</span>
          </motion.div>
        </AnimatePresence>

        {/* Timer Section: Flex layout, themed background, rounded, padding */}
        <div className="flex items-center justify-between bg-background-light-secondary dark:bg-background-dark rounded-md p-3">
          <Timer
            time={metrics.activeTime}
            // Assuming 'inactive' is a possible status, check against it
            isActive={flowState.status !== "inactive"}
            variant={flowState.status === "peak" ? "highlight" : "normal"}
          />
        </div>

        {/* Interrupt Button: Themed background/text, hover effect, disabled state */}
        <button
          className="mt-auto px-4 py-2 bg-error-light-muted text-error-light dark:bg-error-dark-muted dark:text-error-dark rounded-md hover:bg-error-light/30 dark:hover:bg-error-dark/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onInterrupt}
          disabled={flowState.status === "inactive"}
        >
          Record Interruption
        </button>
      </div>
    </motion.div>
  );
};
