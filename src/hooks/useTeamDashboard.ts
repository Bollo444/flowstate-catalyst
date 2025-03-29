// src/hooks/useTeamDashboard.ts

import { useState, useCallback } from "react";
import { useFlowStore } from "../stores/flowStore";

export interface DashboardState {
  timeframe: "day" | "week" | "month";
  activeFilters: string[];
  selectedMetrics: string[];
  viewMode: "detailed" | "summary";
  lastUpdate: Date;
}

export const useTeamDashboard = () => {
  const [state, setState] = useState<DashboardState>({
    timeframe: "week",
    activeFilters: [],
    selectedMetrics: ["flowScore", "productivity", "collaboration"],
    viewMode: "detailed",
    lastUpdate: new Date(),
  });

  const updateDashboardState = useCallback(
    (updates: Partial<DashboardState>) => {
      setState((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const resetDashboard = useCallback(() => {
    setState({
      timeframe: "week",
      activeFilters: [],
      selectedMetrics: ["flowScore", "productivity", "collaboration"],
      viewMode: "detailed",
      lastUpdate: new Date(),
    });
  }, []);

  return {
    state,
    updateDashboardState,
    resetDashboard,
  };
};
