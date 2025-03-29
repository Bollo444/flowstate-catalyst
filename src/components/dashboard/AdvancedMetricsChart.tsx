// src/components/dashboard/AdvancedMetricsChart.tsx

import React, { useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Brush,
  ComposedChart,
} from "recharts";
import styles from "./AdvancedMetricsChart.module.css";
import { chartConfigs } from "../../utils/chartUtils";
import { formatTimestamp } from "../../utils/formatters";
import Slider from "@mui/material/Slider";
import { ChartConfig, ProcessedMetric } from "../../types/dashboard";

interface AdvancedMetricsChartProps {
  data: ProcessedMetric[];
  selectedMetrics: string[];
  timeframe: string;
  onMetricClick?: (metric: string) => void;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipLabel}>{formatTimestamp(label, "day")}</p>
        {payload.map((entry: any) => {
          const config = chartConfigs[entry.name];
          if (!config) return null;
          return (
            <div
              key={entry.name}
              className={styles.tooltipItem}
              style={{ color: entry.color }}
            >
              <span>{config.label}:</span>
              <span>{config.formatter(entry.value)}</span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

const generateChartInsights = (
  data: ProcessedMetric[],
  metrics: string[]
): string[] => {
  const insights: string[] = [];

  metrics.forEach((metric) => {
    const config = chartConfigs[metric];
    if (!config) return;

    const values = data.map((d) => d[metric] as number);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const trend =
      values.length > 1
        ? ((values[values.length - 1] - values[0]) / values[0]) * 100
        : 0;

    insights.push(
      `${config.label}: ${
        trend > 0 ? "Increasing" : "Decreasing"
      } trend (${Math.abs(trend).toFixed(1)}%), Average: ${avg.toFixed(1)}`
    );
  });

  return insights;
};

export const AdvancedMetricsChart: React.FC<AdvancedMetricsChartProps> = ({
  data,
  selectedMetrics,
  timeframe,
  onMetricClick,
}) => {
  const [focusedMetric, setFocusedMetric] = useState<string | null>(null);
  const [zoomTimeframe, setZoomTimeframe] = useState<number[]>([0, 100]);

  const handleZoom = useCallback(
    (event: Event, newValue: number | number[]) => {
      setZoomTimeframe(Array.isArray(newValue) ? newValue : [0, 100]);
    },
    []
  );

  const handleBrushChange = useCallback(
    (brushData: any) => {
      if (brushData && brushData.startIndex !== undefined) {
        const total = data.length;
        const start = (brushData.startIndex / total) * 100;
        const end = (brushData.endIndex / total) * 100;
        setZoomTimeframe([start, end]);
      }
    },
    [data.length]
  );

  return (
    <div className={styles.advancedChartContainer}>
      <div className={styles.chartControls}>
        <div className={styles.metricToggle}>
          {Object.entries(chartConfigs).map(([key, config]) => (
            <button
              key={key}
              className={`${styles.metricButton} ${
                selectedMetrics.includes(key) ? styles.active : ""
              }`}
              onClick={() => onMetricClick?.(key)}
              style={{ borderColor: config.color }}
            >
              {config.label}
            </button>
          ))}
        </div>

        <div className={styles.timeframeZoom}>
          <Slider
            value={zoomTimeframe}
            onChange={handleZoom}
            min={0}
            max={100}
            step={1}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data}>
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => formatTimestamp(value, timeframe)}
          />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip content={<CustomTooltip />} />
          <Legend onClick={(e) => setFocusedMetric(e?.dataKey as string)} />

          {selectedMetrics.map((metric) => {
            const config = chartConfigs[metric];
            if (!config) return null;

            return metric === "sessionCount" ? (
              <Bar
                key={metric}
                dataKey={metric}
                fill={config.color}
                yAxisId="right"
                opacity={
                  focusedMetric ? (focusedMetric === metric ? 1 : 0.3) : 1
                }
              />
            ) : (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={config.color}
                strokeWidth={2}
                dot={false}
                yAxisId="left"
                opacity={
                  focusedMetric ? (focusedMetric === metric ? 1 : 0.3) : 1
                }
              />
            );
          })}

          <Brush
            dataKey="timestamp"
            height={30}
            stroke="#8884d8"
            onChange={handleBrushChange}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className={styles.chartInsights}>
        {generateChartInsights(data, selectedMetrics).map((insight, index) => (
          <p key={index} className={styles.insight}>
            {insight}
          </p>
        ))}
      </div>
    </div>
  );
};
