import React from "react";

// Assuming the PerformanceMetric interface is defined elsewhere
// or we can redefine/import it here if needed.
interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
}

interface MetricsBreakdownProps {
  metrics: PerformanceMetric[];
}

// Basic styling (consider moving to a CSS module)
const containerStyle: React.CSSProperties = {
  marginTop: "24px",
  padding: "16px",
  border: "1px solid #eee",
  borderRadius: "8px",
  backgroundColor: "#fff",
};

const titleStyle: React.CSSProperties = {
  fontSize: "1.2em",
  fontWeight: "bold",
  marginBottom: "16px",
};

const listStyle: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
};

const listItemStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px solid #f0f0f0",
};

const metricNameStyle: React.CSSProperties = {
  color: "#333",
};

const metricValueStyle: React.CSSProperties = {
  fontWeight: "bold",
};

export const MetricsBreakdown: React.FC<MetricsBreakdownProps> = ({
  metrics,
}) => {
  if (!metrics || metrics.length === 0) {
    return <div style={containerStyle}>No metrics available.</div>;
  }

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>Metrics Breakdown</div>
      <ul style={listStyle}>
        {metrics.map((metric) => (
          <li key={metric.id} style={listItemStyle}>
            <span style={metricNameStyle}>{metric.name}</span>
            <span style={metricValueStyle}>
              {metric.value} {metric.unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// export default MetricsBreakdown; // If using default exports
