"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ActivityMetrics } from "@/types/flow"; // Keep ActivityMetrics
import { FlowStatus } from "@/types/database"; // Keep FlowStatus
import clsx from 'clsx';
// Import icons for metrics
import { Clock, Zap, CheckCircle as CheckIcon } from 'lucide-react';

interface FlowScoreProps {
  score: number;
  status: FlowStatus;
  metrics: ActivityMetrics;
  showDetails?: boolean;
}

export const FlowScore: React.FC<FlowScoreProps> = ({
  score,
  status,
  metrics,
  showDetails = false,
}) => {
  const [prevScore, setPrevScore] = useState(score);
  // isIncreasing state removed as it wasn't used for score animation logic here

  useEffect(() => {
    setPrevScore(score);
  }, [score, prevScore]); // Added prevScore to dependency array

  // Map status to Tailwind theme color classes for backgrounds, text, and borders
  const statusClasses: Record<FlowStatus | 'inactive', { bg: string, text: string, border: string }> = {
      peak: { bg: 'bg-success-light-muted dark:bg-success-dark-muted', text: 'text-success-light dark:text-success-dark', border: 'border-success-light/50 dark:border-success-dark/50' },
      flow: { bg: 'bg-accent-light-muted dark:bg-accent-dark-muted', text: 'text-accent-light dark:text-accent-dark', border: 'border-accent-light/50 dark:border-accent-dark/50' },
      building: { bg: 'bg-warning-light-muted dark:bg-warning-dark-muted', text: 'text-warning-light dark:text-warning-dark', border: 'border-warning-light/50 dark:border-warning-dark/50' },
      rest: { bg: 'bg-error-light-muted dark:bg-error-dark-muted', text: 'text-error-light dark:text-error-dark', border: 'border-error-light/50 dark:border-error-dark/50' },
      inactive: { bg: 'bg-gray-200 dark:bg-gray-700', text: 'text-gray-500 dark:text-gray-400', border: 'border-gray-300/50 dark:border-gray-600/50' }
  };

  // Get the appropriate classes based on the current status, default to inactive
  const currentStatusClasses = statusClasses[status as FlowStatus] || statusClasses.inactive;

  return (
    <motion.div
      // Use themed background, text, padding, rounded etc.
      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-background-light dark:bg-background-dark-secondary shadow-lg text-foreground-light dark:text-foreground-dark" // Center items, use theme colors
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Score Container */}
      <div className="flex flex-col items-center gap-2"> {/* Was styles.scoreContainer */}
        <motion.div
          // Use themed border, conditional background/opacity/shadow based on status
          className={clsx(
            "w-24 h-24 rounded-full flex items-center justify-center border transition-all duration-300",
            currentStatusClasses.border,
            currentStatusClasses.bg // Apply background based on status
          )}
          style={{ opacity: Math.max(0.3, score / 100) }} // Ensure minimum opacity
          animate={{
            scale: [1, 1.05, 1],
            // boxShadow: `0 0 ${status === "peak" ? "20px" : "10px"} ${statusColors[status]}`, // Removed for simplicity, can add themed shadow later
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="text-3xl font-bold text-inherit" // Inherit text color from parent
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }} // Simplified animation
            transition={{ duration: 0.3 }}
          >
            {score}
          </motion.div>
        </motion.div>
        <div className="text-sm text-foreground-light-secondary dark:text-foreground-dark-secondary">Flow Score</div> {/* Was styles.label */}
      </div>

      <AnimatePresence mode="wait">
        {/* Status text with themed conditional styles */}
        <motion.div
          key={status}
          className={clsx(
            "text-center py-1 px-3 rounded-full text-sm font-medium border", // Base styles
            currentStatusClasses.bg, // Status specific background
            currentStatusClasses.text, // Status specific text
            currentStatusClasses.border // Status specific border
          )}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
        >
          {/* Capitalize status */}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </motion.div>
      </AnimatePresence>

      {showDetails && (
        <motion.div
          className="mt-4 overflow-hidden w-full" // Direct Tailwind
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
        >
           {/* Metrics grid */}
          <div className="grid grid-cols-3 gap-2">
            <MetricItem
              label="Focus Time"
              value={`${Math.floor(metrics.activeTime)}m`}
              icon={<Clock size={18} />} // Use Lucide icon
            />
            <MetricItem
              label="Interruptions"
              value={metrics.interruptions.toString()}
              icon={<Zap size={18} />} // Use Lucide icon
            />
            <MetricItem
              label="Task Comp." // Shortened label
              value={metrics.taskCompletions.toString()}
              icon={<CheckIcon size={18} />} // Use Lucide icon
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const MetricItem: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => (
   // Metric item styling using Tailwind and theme colors
  <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-background-light-secondary dark:bg-background-dark">
    <span className="text-lg text-foreground-light-secondary dark:text-foreground-dark-secondary">{icon}</span>
    <span className="text-lg font-semibold text-foreground-light dark:text-foreground-dark">{value}</span>
    <span className="text-xs text-foreground-light-secondary dark:text-foreground-dark-secondary">{label}</span>
  </div>
);

// Removed statusColors object
