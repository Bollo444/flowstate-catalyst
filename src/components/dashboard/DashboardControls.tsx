// src/components/dashboard/DashboardControls.tsx
import React from "react";
import { useTeamDashboard } from "@/hooks/useTeamDashboard"; // Corrected path
import { MultiSelect } from "../shared/MultiSelect"; // Remove Option import
import clsx from "clsx"; // Import clsx for conditional classes

interface Option { // Define Option struct locally for availableMetrics type safety
  value: string;
  label: string;
}

const availableMetrics: Option[] = [ // Add type annotation if MultiSelect expects typed options
  { value: "flowScore", label: "Flow Score" },
  { value: "sessions", label: "Sessions" },
  { value: "activeUsers", label: "Active Users" },
  { value: "achievements", label: "Achievements" },
];

export const DashboardControls: React.FC = () => {
  const { state, updateDashboardState } = useTeamDashboard();

  return (
    // Container: Flex layout (responsive), gap, themed background, rounded, shadow
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-background-light dark:bg-background-dark-secondary rounded-lg shadow-md mb-6">
      {/* Timeframe Selector: Flex container */}
      <div className="flex">
        {/* Timeframe Buttons: Base styles + conditional active styles */}
        <button
          className={clsx(
            "px-4 py-2 mr-2 rounded-md transition-colors duration-200 ease-in-out text-sm", // Added text-sm
            state.timeframe === "day"
              ? "bg-primary-light dark:bg-primary-dark text-white"
              : "bg-background-light-secondary dark:bg-background-dark hover:bg-gray-200 dark:hover:bg-gray-700 text-foreground-light dark:text-foreground-dark"
          )}
          onClick={() => updateDashboardState({ timeframe: "day" })}
        >
          Day
        </button>
        <button
          className={clsx(
            "px-4 py-2 mr-2 rounded-md transition-colors duration-200 ease-in-out text-sm", // Added text-sm
            state.timeframe === "week"
              ? "bg-primary-light dark:bg-primary-dark text-white"
              : "bg-background-light-secondary dark:bg-background-dark hover:bg-gray-200 dark:hover:bg-gray-700 text-foreground-light dark:text-foreground-dark"
          )}
          onClick={() => updateDashboardState({ timeframe: "week" })}
        >
          Week
        </button>
        <button
          className={clsx(
            "px-4 py-2 rounded-md transition-colors duration-200 ease-in-out text-sm", // Added text-sm
            state.timeframe === "month"
              ? "bg-primary-light dark:bg-primary-dark text-white"
              : "bg-background-light-secondary dark:bg-background-dark hover:bg-gray-200 dark:hover:bg-gray-700 text-foreground-light dark:text-foreground-dark"
          )}
          onClick={() => updateDashboardState({ timeframe: "month" })}
        >
          Month
        </button>
      </div>

      {/* Metric Selector: Use MultiSelect component */}
      <div className="min-w-[200px]">
        <MultiSelect
          options={availableMetrics}
          value={state.selectedMetrics} // Correct prop name to 'value'
          onChange={(selected) => updateDashboardState({ selectedMetrics: selected })}
          placeholder="Select Metrics"
        />
      </div>

      {/* View Toggle Button: Themed background and text */}
      <div>
        <button
          className="px-4 py-2 rounded-md bg-background-light-secondary dark:bg-background-dark hover:bg-gray-200 dark:hover:bg-gray-700 text-foreground-light dark:text-foreground-dark transition-colors duration-200 ease-in-out text-sm" // Added text-sm
          onClick={() =>
            updateDashboardState({
              viewMode: state.viewMode === "detailed" ? "summary" : "detailed",
            })
          }
        >
          {state.viewMode === "detailed" ? "Show Summary" : "Show Details"}
        </button>
      </div>
    </div>
  );
};
