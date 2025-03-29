import React from "react";
import { usePerformanceData } from "@/hooks/usePerformanceData"; // Assuming '@/' maps to 'src/'
import { InsightCards } from "./InsightCards";
import { MetricsBreakdown } from "./MetricsBreakdown";
import { TrendAnalysis } from "./TrendAnalysis";
import { LoadingSpinner } from "@/components/LoadingSpinner"; // Assuming a loading spinner component exists

export const PerformanceInsights: React.FC = () => {
  const { insights, metrics, loading, error } = usePerformanceData();

  if (loading) {
    // Consider a more specific loading indicator for this section
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="error-message">
        Error loading performance data: {error.message}
      </div>
    );
  }

  // Add some basic structure/styling container
  const containerStyle: React.CSSProperties = {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fafafa",
    marginTop: "20px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "1.5em",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  };

  return (
    <div style={containerStyle} className="performance-insights">
      <div style={titleStyle}>Performance Insights</div>
      <InsightCards insights={insights} />
      <MetricsBreakdown metrics={metrics} />
      <TrendAnalysis /> {/* TrendAnalysis doesn't take data yet */}
    </div>
  );
};
