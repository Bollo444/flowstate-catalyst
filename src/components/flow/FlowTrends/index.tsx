import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./styles.module.css";

interface FlowTrendsProps {
  data: Array<{
    timestamp: string;
    score: number;
  }>;
}

const FlowTrends: React.FC<FlowTrendsProps> = ({ data }) => {
  const formattedData = data.map((point) => ({
    ...point,
    time: new Date(point.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  return (
    <div className={styles.trends}>
      <h4>Flow Trends</h4>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={formattedData}>
            <XAxis
              dataKey="time"
              tick={{ fill: "#A0A0A0", fontSize: 12 }}
              stroke="#404040"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#A0A0A0", fontSize: 12 }}
              stroke="#404040"
            />
            <Tooltip
              contentStyle={{
                background: "#2D2D2D",
                border: "1px solid #404040",
                borderRadius: "4px",
                color: "#E0E0E0",
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#4A9EFF"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FlowTrends;
