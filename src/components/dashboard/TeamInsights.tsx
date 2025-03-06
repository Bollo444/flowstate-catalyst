// src/components/dashboard/TeamInsights.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Brush, ComposedChart } from 'recharts';
import styles from './TeamInsights.module.css';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorDisplay } from '../shared/ErrorDisplay';
import { AppError } from '../../types/error'; // Import AppError
import { MetricsChart } from './MetricsChart'; // Import MetricsChart component

interface TeamInsightsProps {
  teamId: string, 
  timeframe: string, 
  selectedMetrics: string[] 
}

export const TeamInsights: React.FC<TeamInsightsProps> = ({
  teamId,
  timeframe,
  selectedMetrics
}) => {
  const metrics = { // Placeholder data
    flowScores: [], 
    sessions: [],
    peakHours: '3-4 PM',
    peakHoursTrend: { direction: 'up', percentage: 15 },
    syncRate: 85,
    syncRateTrend: { direction: 'down', percentage: 5 },
    consistency: 92,
    consistencyTrend: { direction: 'up', percentage: 8 }
  };

  return (
    <div className={styles.insightsContainer}>
      <div className={styles.insightsHeader}>
        <h3>Team Performance Insights</h3>
        <div className={styles.timeframeSelector}>
          Timeframe selection controls - future implementation
        </div>
      </div>

      <div className={styles.chartsGrid}>
        {/* Flow Score Trends */}
        <div className={styles.chartCard}>
          <h4>Flow Score Trends</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.flowScores}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="flowScore" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Session Distribution */}
        <div className={styles.chartCard}>
          <h4>Session Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.sessions}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sessionCount" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        {/* Metric Cards */}
      </div>
    </div>
  );
};