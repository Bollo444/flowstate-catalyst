import React from "react";

// Assuming the PerformanceInsight interface is defined elsewhere
// or we can redefine/import it here if needed.
interface PerformanceInsight {
  id: string;
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "stable";
}

interface InsightCardsProps {
  insights: PerformanceInsight[];
}

// Basic styling (consider moving to a CSS module)
const cardStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "16px",
  margin: "8px",
  minWidth: "150px",
  textAlign: "center",
  backgroundColor: "#f9f9f9",
};

const titleStyle: React.CSSProperties = {
  fontSize: "0.9em",
  color: "#555",
  marginBottom: "8px",
};

const valueStyle: React.CSSProperties = {
  fontSize: "1.5em",
  fontWeight: "bold",
  marginBottom: "4px",
};

const changeStyle: React.CSSProperties = {
  fontSize: "0.8em",
};

const getTrendColor = (trend?: "up" | "down" | "stable") => {
  switch (trend) {
    case "up":
      return "green";
    case "down":
      return "red";
    default:
      return "grey";
  }
};

export const InsightCards: React.FC<InsightCardsProps> = ({ insights }) => {
  if (!insights || insights.length === 0) {
    return <div>No insights available.</div>;
  }

  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      {insights.map((insight) => (
        <div key={insight.id} style={cardStyle}>
          <div style={titleStyle}>{insight.title}</div>
          <div style={valueStyle}>{insight.value}</div>
          {insight.change !== undefined && (
            <div
              style={{ ...changeStyle, color: getTrendColor(insight.trend) }}
            >
              {insight.trend === "up"
                ? "▲"
                : insight.trend === "down"
                  ? "▼"
                  : ""}
              {insight.change}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Exporting the component as default or named export depending on project convention
// export default InsightCards; // If using default exports
