"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, TrendingUp, Zap, RefreshCw } from "lucide-react";
import { useFlowContext } from "@/context/FlowContext";
import { useFlowAnalytics } from "@/hooks/useFlowAnalytics";
import { SimpleChart } from "./SimpleChart";
import { TimeRangeOption } from "@/types/analytics";
import styles from "./Analytics.module.css";

interface TaskAnalyticsProps {
  userId: string;
  teamId?: string;
  timeRange: TimeRangeOption;
}

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
}

export const TaskAnalytics: React.FC<TaskAnalyticsProps> = ({
  userId,
  teamId,
  timeRange,
}) => {
  const { flowState } = useFlowContext();
  const { metrics, loading, error } = useFlowAnalytics({
    userId,
    teamId,
    timeRange,
  });

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.pulse} />
        <span>Loading metrics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error loading analytics: {error.message}</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={styles.empty}>
        <p>No analytics data available</p>
      </div>
    );
  }

  const cards: MetricCard[] = [
    {
      title: "Average Flow Score",
      value: Math.round(metrics.averageMetrics.flowScore),
      change: 12,
      icon: <TrendingUp className={styles.icon} />,
      trend: "up",
    },
    {
      title: "Tasks Completed",
      value: metrics.averageMetrics.taskCompletions,
      change: 3,
      icon: <Zap className={styles.icon} />,
      trend: "up",
    },
    {
      title: "Active Time",
      value: `${Math.round(metrics.averageMetrics.activeTime)}m`,
      change: 15,
      icon: <Clock className={styles.icon} />,
      trend: "up",
    },
    {
      title: "Context Switches",
      value: metrics.averageMetrics.contextSwitches,
      change: -2,
      icon: <RefreshCw className={styles.icon} />,
      trend: "down",
    },
  ];

  const flowScoreData = metrics.flowScoreHistory;
  const taskCompletionData = metrics.taskCompletion;

  return (
    <div className={styles.analytics}>
      <div className={styles.metricsGrid}>
        <AnimatePresence>
          {cards.map((metric: MetricCard, index: number) => (
            <motion.div
              key={metric.title}
              className={styles.metricCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.metricHeader}>
                <h3>{metric.title}</h3>
                {metric.icon}
              </div>
              <div className={styles.metricValue}>
                {metric.value}
                <span
                  className={`${styles.change} ${
                    metric.trend === "up"
                      ? styles.positive
                      : metric.trend === "down"
                        ? styles.negative
                        : ""
                  }`}
                >
                  {metric.change > 0 ? "+" : ""}
                  {metric.change}%
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className={styles.chartsGrid}>
        <SimpleChart
          data={flowScoreData}
          type="line"
          height={300}
          title="Flow Score Trends"
        />
        <SimpleChart
          data={taskCompletionData}
          type="bar"
          height={300}
          title="Task Completion Analysis"
        />
      </div>
    </div>
  );
};

export default TaskAnalytics;
