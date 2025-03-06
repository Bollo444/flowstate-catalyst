// src/components/dashboard/DashboardControls.tsx
import React from 'react';
import styles from './DashboardControls.module.css';
import { useTeamDashboard } from '../../hooks/useTeamDashboard';
import { MultiSelect } from '../shared/MultiSelect'; // Assuming MultiSelect component exists

const availableMetrics = [
  { value: 'flowScore', label: 'Flow Score' },
  { value: 'sessions', label: 'Sessions' },
  { value: 'activeUsers', label: 'Active Users' },
  { value: 'achievements', label: 'Achievements' },
];

export const DashboardControls: React.FC = () => {
  const { state, updateDashboardState } = useTeamDashboard();

  return (
    <div className={styles.controlsContainer}>
      <div className={styles.timeframeSelector}>
        <button 
          className={`${styles.timeframeButton} ${
            state.timeframe === 'day' ? styles.active : ''
          }`}
          onClick={() => updateDashboardState({ timeframe: 'day' })}
        >
          Day
        </button>
        <button 
          className={`${styles.timeframeButton} ${
            state.timeframe === 'week' ? styles.active : ''
          }`}
          onClick={() => updateDashboardState({ timeframe: 'week' })}
        >
          Week
        </button>
        <button 
          className={`${styles.timeframeButton} ${
            state.timeframe === 'month' ? styles.active : ''
          }`}
          onClick={() => updateDashboardState({ timeframe: 'month' })}
        >
          Month
        </button>
      </div>

      <div className={styles.metricSelector}>
        {/* Replace MultiSelect with actual MultiSelect component */}
        <select multiple>
          {availableMetrics.map(metric => (
            <option key={metric.value} value={metric.value}>{metric.label}</option>
          ))}
        </select>
      </div>

      <div className={styles.viewToggle}>
        <button
          onClick={() => updateDashboardState({ 
            viewMode: state.viewMode === 'detailed' ? 'summary' : 'detailed' 
          })}
        >
          {state.viewMode === 'detailed' ? 'Show Summary' : 'Show Details'}
        </button>
      </div>
    </div>
  );
};