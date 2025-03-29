// src/components/dashboard/TeamInsights.tsx
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { MetricsChart } from "./MetricsChart";
import { useTeamMetrics } from "@/hooks/useTeamMetrics"; // Corrected path

interface TeamInsightsProps {
  teamId: string;
  timeframe: string;
  selectedMetrics: string[];
}

export const TeamInsights: React.FC<TeamInsightsProps> = ({
  teamId,
  timeframe,
  selectedMetrics,
}) => {
  // Correct destructuring based on hook's likely return type { metrics, loading, error }
  const { metrics, loading, error } = useTeamMetrics(teamId, timeframe);

  const formattedMetrics = useMemo(() => {
    if (!metrics) return [];
    // Define a basic type for the metric object inline to resolve 'any' type error
    type MetricType = {
      timestamp: string;
      flowScore: number;
      productivity: number;
      collaboration: number;
      focusTime: number;
    };

    return metrics.map((metric: MetricType) => ({
      name: metric.timestamp,
      flowScore: metric.flowScore,
      productivity: metric.productivity,
      collaboration: metric.collaboration,
      focusTime: metric.focusTime,
    }));
  }, [metrics]);

  if (loading) // Use 'loading' instead of 'isLoading'
    // Basic loading/error states using theme colors
    return <div className="p-6 text-center text-foreground-light-secondary dark:text-foreground-dark-secondary">Loading metrics...</div>;
  if (error) return <div className="p-6 text-center text-error-light dark:text-error-dark bg-error-light-muted dark:bg-error-dark-muted rounded-lg">{error.message}</div>;

  return (
    // Main container: Themed background, rounded, padding, shadow
    <div className="bg-background-light dark:bg-background-dark-secondary rounded-lg p-6 shadow-md">
       {/* TODO: Add a main title for the insights section if needed */}
      {/* Metrics Grid: Responsive grid layout, gap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Metric Card: Themed background, rounded, padding, shadow, text center */}
        {/* Using slightly different background for cards for contrast */}
        <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg shadow text-center">
          <h3 className="mb-2 text-lg font-semibold text-foreground-light dark:text-foreground-dark">Team Flow Score</h3>
          <MetricsChart
            data={formattedMetrics}
            metrics={[
              {
                name: "flowScore",
                color: "#8884d8",
                formatter: (value) => `${value.toFixed(1)}%`,
              },
            ]}
          />
        </div>

        {/* Metric Card: Themed background, rounded, padding, shadow, text center */}
        <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg shadow text-center">
          <h3 className="mb-2 text-lg font-semibold text-foreground-light dark:text-foreground-dark">Productivity Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={formattedMetrics}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="productivity" fill="#82ca9d" />
              <Line type="monotone" dataKey="focusTime" stroke="#ff7300" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
