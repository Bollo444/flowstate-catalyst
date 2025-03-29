// src/components/flow/FlowWhispers/FlowStreakManager.tsx

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import styles from "./styles.module.css";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  totalDaysActive: number;
}

interface FlowMetrics {
  dailyScore: number;
  weeklyAverage: number;
  monthlyProgress: number;
}

export const FlowStreakManager: React.FC = () => {
  // State Management
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: "",
    totalDaysActive: 0,
  });

  const [metrics, setMetrics] = useState<FlowMetrics>({
    dailyScore: 0,
    weeklyAverage: 0,
    monthlyProgress: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch and update streak data
  const fetchStreakData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_streaks")
        .select("*")
        .single();

      if (error) throw error;

      if (data) {
        setStreakData({
          currentStreak: data.current_streak,
          longestStreak: data.longest_streak,
          lastActiveDate: data.last_active_date,
          totalDaysActive: data.total_days_active,
        });
      }
    } catch (err) {
      setError("Failed to fetch streak data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update daily flow metrics
  const updateDailyMetrics = async () => {
    // Implementation for updating daily metrics
    // This would integrate with our flow state tracking
  };

  useEffect(() => {
    fetchStreakData();
    const subscription = supabase
      .channel("streak_updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_streaks",
        },
        (payload) => {
          // Handle real-time updates
          setStreakData((prevData) => ({
            ...prevData,
            ...payload.new,
          }));
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Loading your flow streak...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button onClick={fetchStreakData}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.streakManager}>
      <div className={styles.streakHeader}>
        <h2>Your Flow Streak</h2>
        <div className={styles.streakCount}>
          {streakData.currentStreak}
          <span>days</span>
        </div>
      </div>

      <div className={styles.streakMetrics}>
        <div className={styles.metricCard}>
          <span>Longest Streak</span>
          <strong>{streakData.longestStreak} days</strong>
        </div>
        <div className={styles.metricCard}>
          <span>Total Active Days</span>
          <strong>{streakData.totalDaysActive}</strong>
        </div>
      </div>

      <div className={styles.flowProgress}>
        <h3>Today's Flow</h3>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${metrics.dailyScore}%` }}
          />
        </div>
      </div>

      <div className={styles.weeklyOverview}>
        {/* Weekly progress visualization */}
        <div className={styles.weekGrid}>
          {/* Implementation for weekly view */}
        </div>
      </div>
    </div>
  );
};

export default FlowStreakManager;
