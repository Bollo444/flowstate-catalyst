import React, { useState, useEffect } from "react";
import {
  useProgressAnalytics,
  ProgressAnalytics,
} from "../../../hooks/useProgressAnalytics";
import { Chart } from "../../shared/Chart";
import { LoadingSpinner } from "../../shared/LoadingSpinner";
import { ErrorDisplay } from "../../shared/ErrorDisplay";
import styles from "./styles.module.css";

interface ProgressAnalyticsProps {
  projectId?: string;
  userId?: string;
}

export const ProgressAnalyticsComponent: React.FC<ProgressAnalyticsProps> = ({
  projectId,
  userId,
}) => {
  const { analytics, loading, error, fetchAnalytics } = useProgressAnalytics();
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">(
    "month"
  );

  useEffect(() => {
    fetchAnalytics({
      projectId,
      userId,
      startDate: getStartDate(timeframe),
      endDate: new Date().toISOString(),
    });
  }, [projectId, userId, timeframe]);

  const getStartDate = (timeframe: string): string => {
    const date = new Date();
    switch (timeframe) {
      case "week":
        date.setDate(date.getDate() - 7);
        break;
      case "month":
        date.setMonth(date.getMonth() - 1);
        break;
      case "year":
        date.setFullYear(date.getFullYear() - 1);
        break;
    }
    return date.toISOString();
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <ErrorDisplay
          error={{
            code: "ANALYTICS_ERROR",
            message: "Failed to load progress analytics",
            details: error,
          }}
        />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className={styles.empty}>
        <p>No analytics data available</p>
      </div>
    );
  }

  const progressTrendData = {
    labels: analytics.progressTrend.map((point) => {
      const date = new Date(point.date);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }),
    datasets: [
      {
        label: "Average Progress",
        data: analytics.progressTrend.map((point) => point.progress),
        borderColor: "#4A9EFF",
        backgroundColor: "rgba(74, 158, 255, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const completionRateData = {
    labels: ["Completed", "In Progress"],
    datasets: [
      {
        data: [analytics.completionRate, 100 - analytics.completionRate],
        backgroundColor: ["#4CAF50", "#FFAA4C"],
      },
    ],
  };

  const teamPerformanceData = {
    labels: analytics.progressByUser.map((user) => user.userName),
    datasets: [
      {
        label: "Average Progress",
        data: analytics.progressByUser.map((user) => user.averageProgress),
        backgroundColor: "rgba(74, 158, 255, 0.8)",
      },
      {
        label: "Tasks Completed",
        data: analytics.progressByUser.map((user) => user.tasksCompleted),
        backgroundColor: "rgba(76, 175, 80, 0.8)",
      },
    ],
  };

  const velocityData = {
    labels: ["Daily", "Weekly Average", "Monthly Average"],
    datasets: [
      {
        label: "Task Completion Rate",
        data: [
          analytics.taskVelocity.daily,
          analytics.taskVelocity.weekly,
          analytics.taskVelocity.monthly,
        ],
        backgroundColor: ["#FF4C4C", "#FFAA4C", "#4CAF50"],
      },
    ],
  };

  return (
    <div className={styles.analytics}>
      <div className={styles.header}>
        <h2>Progress Analytics</h2>
        <div className={styles.timeframeControls}>
          <button
            className={timeframe === "week" ? styles.active : ""}
            onClick={() => setTimeframe("week")}
          >
            Week
          </button>
          <button
            className={timeframe === "month" ? styles.active : ""}
            onClick={() => setTimeframe("month")}
          >
            Month
          </button>
          <button
            className={timeframe === "year" ? styles.active : ""}
            onClick={() => setTimeframe("year")}
          >
            Year
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Progress Trend</h3>
          <Chart type="line" data={progressTrendData} height={200} />
        </div>

        <div className={styles.card}>
          <h3>Completion Rate</h3>
          <Chart type="bar" data={completionRateData} height={200} />
        </div>

        <div className={styles.card}>
          <h3>Team Performance</h3>
          <Chart type="bar" data={teamPerformanceData} height={200} />
        </div>

        <div className={styles.card}>
          <h3>Task Velocity</h3>
          <Chart type="bar" data={velocityData} height={200} />
        </div>

        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span className={styles.label}>Average Time to Completion</span>
            <span className={styles.value}>
              {analytics.timeToCompletion.average.toFixed(1)} days
            </span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>Fastest Completion</span>
            <span className={styles.value}>
              {analytics.timeToCompletion.fastest.toFixed(1)} days
            </span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>Slowest Completion</span>
            <span className={styles.value}>
              {analytics.timeToCompletion.slowest.toFixed(1)} days
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
