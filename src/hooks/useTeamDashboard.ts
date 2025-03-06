// src/hooks/useTeamDashboard.ts

import { useState } from 'react';

interface DashboardState {
  timeframe: 'day' | 'week' | 'month';
  activeFilters: string[];
  selectedMetrics: string[];
  viewMode: 'detailed' | 'summary';
}

export const useTeamDashboard = () => {
  const [state, setState] = useState<DashboardState>({
    timeframe: 'week',
    activeFilters: [],
    selectedMetrics: ['flowScore', 'sessions', 'activeUsers'],
    viewMode: 'detailed'
  });

  const updateDashboardState = (updates: Partial<DashboardState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return {
    state,
    updateDashboardState
  };
};