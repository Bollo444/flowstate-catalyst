import React from "react";
import styles from "./FlowMetrics.module.css";
import { useFlowStore } from "../../../stores/flowStore";
import { MetricCard } from "../../shared/MetricCard";
import { FlowTrends } from "../../flow/FlowTrends";
import { formatDuration } from "../../../utils/timeUtils";

export const FlowMetrics: React.FC = () => {
  const { metrics } = useFlowStore();

  return (
    <div className={styles.metricsContainer}>
      <div className={styles.metricCards}>
        <MetricCard
          title="Focus Time"
          value={formatDuration(metrics.focusTime)}
          icon="⚡"
        />
        <MetricCard
          title="Flow Score"
          value={`${metrics.flowScore}%`}
          icon="🌊"
        />
        <MetricCard
          title="Tasks Completed"
          value={metrics.completedTasks}
          icon="✅"
        />
      </div>

      <div className={styles.metricChart}>
        <FlowTrends data={metrics.history} />
      </div>
    </div>
  );
};
