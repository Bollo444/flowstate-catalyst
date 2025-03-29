// src/components/dashboard/TeamFlowDashboard.tsx

import React, { useState, useEffect } from "react";
import { useSupabaseClient, User } from "@supabase/auth-helpers-react";
import { DashboardControls } from "./DashboardControls";
import { DashboardLayout } from "./DashboardLayout";
import { TeamInsights } from "./TeamInsights";
import { ActivityFeed } from "../team/ActivityFeed";
import { QuickActions } from "./QuickActions";
import { FlowStreakManager } from "../flow/FlowWhispers/FlowStreakManager";
import { useTeamDashboard } from "../../hooks/useTeamDashboard";
import styles from "./TeamFlowDashboard.module.css";
import { ErrorBoundary } from "react-error-boundary";
import { DashboardState, Team, Notification } from "../../types/flow";
import { FlowSystemValidator } from "../../validation/FlowSystemValidator";
import { DebugLogger } from "../../debug/FlowDebugger";
import { SystemMonitor } from "../../monitoring/FlowPerformanceMonitor";
import { NotificationCenter } from "../../components/notifications/NotificationCenter/index";
import { TeamMetric } from "../../types/metrics";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

interface TeamFlowDashboardProps {
  teamId: string;
}

interface ErrorBoundaryFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => (
  <div className={styles.errorState}>
    <h2>Something went wrong</h2>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
);

const initialMetrics: TeamMetric[] = [
  {
    name: "Focus",
    value: 75,
  },
  {
    name: "Intensity",
    value: 50,
  },
  {
    name: "Collaboration",
    value: 25,
  },
];

export const TeamFlowDashboard: React.FC<TeamFlowDashboardProps> = ({
  teamId,
}) => {
  const supabase: SupabaseClient = useSupabaseClient();
  const user = supabase.auth.user();
  const { state, updateDashboardState } = useTeamDashboard();
  const [teamData, setTeamData] = useState<Team | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    isFullscreen: false,
    activeSection: "overview",
    notifications: [],
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Notification) => {
    setNotifications((prevNotifications) => {
      const newNotification = { ...notification, id: Date.now().toString() };
      const updatedNotifications = [...prevNotifications, newNotification];

      setTimeout(() => {
        setNotifications((currentNotifications) =>
          currentNotifications.filter((n) => n.id !== newNotification.id)
        );
      }, 5000);

      return updatedNotifications;
    });
  };

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("teams")
          .select("*")
          .eq("id", teamId)
          .single();

        if (error) {
          throw error;
        }

        setTeamData(data as Team);
      } catch (error: unknown | PostgrestError) {
        console.error("Error fetching team data:", error);

        if (error instanceof PostgrestError) {
          addNotification({ type: "error", message: error.message });
        } else {
          addNotification({
            type: "error",
            message: "An unexpected error occurred.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [supabase, user, teamId, addNotification]);

  useEffect(() => {
    const validator = new FlowSystemValidator();
    const debugLogger = new DebugLogger();
    const monitor = new SystemMonitor();

    monitor.startMonitoring();

    const validate = async () => {
      const results = await validator.validateDataFlow();
      if (results) {
        results.forEach((result) => {
          if (result.status !== "success") {
            debugLogger.logEvent({ type: "validation_issue", details: result });
            addNotification({
              type: "warning",
              message: `Validation issue: ${result.message}`,
            });
          }
        });
      }
    };

    if (user) {
      validate();
    }

    return () => {
      monitor.stopMonitoring();
      const performanceReport = monitor.generateReport();
      const debugReport = debugLogger.generateDebugReport();
      console.log("Performance Report:", performanceReport);
      console.log("Debug Report:", debugReport);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorBoundaryFallback}
      onError={(error) => {
        debugLogger.logEvent({ type: "error", details: error });
      }}
    >
      <div
        className={`${styles.dashboardContainer} ${
          dashboardState.isFullscreen ? styles.fullscreen : ""
        }`}
      >
        {/* ... other JSX ... */}
      </div>
    </ErrorBoundary>
  );
};

export default TeamFlowDashboard;
