/**
 * Flow score calculation service that determines flow state based on various factors:
 * - Active time (duration of focused work)
 * - Task completion rate
 * - Break intervals
 * - Context switching
 * - Time of day patterns
 */

import { FlowStatus } from "../types/supabase";
import { FlowState, ActivityMetrics } from "../types/flow";

const FLOW_THRESHOLDS = {
  ACTIVE_TIME_MIN: 25, // Minimum time needed to enter flow (25 min)
  ACTIVE_TIME_MAX: 90, // Maximum recommended flow time (90 min)
  BREAK_INTERVAL: 45, // Recommended break interval (45 min)
  CONTEXT_SWITCH_PENALTY: 15, // Score penalty for excessive context switching
  TASK_COMPLETION_BONUS: 10, // Score bonus for completing tasks
};

export class FlowCalculator {
  private static readonly SCORE_WEIGHTS = {
    activeTime: 0.3,
    taskCompletions: 0.2,
    contextSwitches: 0.15,
    breakTiming: 0.2,
    timeOptimization: 0.15,
  };

  static calculateFlowScore(metrics: ActivityMetrics): number {
    let score = 50;

    score +=
      this.calculateActiveTimeFactor(metrics.activeTime) *
      this.SCORE_WEIGHTS.activeTime;
    score +=
      metrics.taskCompletions *
      FLOW_THRESHOLDS.TASK_COMPLETION_BONUS *
      this.SCORE_WEIGHTS.taskCompletions;
    score -=
      metrics.contextSwitches *
      FLOW_THRESHOLDS.CONTEXT_SWITCH_PENALTY *
      this.SCORE_WEIGHTS.contextSwitches;
    score +=
      this.calculateBreakFactor(metrics.lastBreakTime, metrics.activeTime) *
      this.SCORE_WEIGHTS.breakTiming;
    score +=
      this.calculateTimeOptimization(metrics.dayProgress) *
      this.SCORE_WEIGHTS.timeOptimization;

    return Math.max(0, Math.min(100, score));
  }

  static determineFlowStatus(
    score: number,
    metrics: ActivityMetrics
  ): FlowStatus {
    if (score >= 80 && metrics.activeTime >= FLOW_THRESHOLDS.ACTIVE_TIME_MIN) {
      return "peak";
    } else if (score >= 60) {
      return "flow";
    } else if (metrics.activeTime < FLOW_THRESHOLDS.ACTIVE_TIME_MIN) {
      return "building";
    } else {
      return "rest";
    }
  }

  private static calculateActiveTimeFactor(activeTime: number): number {
    const optimalTime = FLOW_THRESHOLDS.ACTIVE_TIME_MAX;
    const rampUpTime = FLOW_THRESHOLDS.ACTIVE_TIME_MIN;

    if (activeTime < rampUpTime) {
      return (activeTime / rampUpTime) * 100;
    } else if (activeTime > optimalTime) {
      const overtime = activeTime - optimalTime;
      return Math.max(0, 100 - (overtime / 30) * 10);
    }
    return 100;
  }

  private static calculateBreakFactor(
    lastBreakTime: Date | undefined,
    activeTime: number
  ): number {
    if (!lastBreakTime) return 50;

    const timeSinceBreak = (Date.now() - lastBreakTime.getTime()) / (1000 * 60);
    const optimalBreakInterval = FLOW_THRESHOLDS.OPTIMAL_BREAK_INTERVAL;

    if (timeSinceBreak < optimalBreakInterval) {
      return 100;
    } else {
      const overdue = timeSinceBreak - optimalBreakInterval;
      return Math.max(0, 100 - (overdue / 15) * 10);
    }
  }

  private static calculateTimeOptimization(dayProgress: number): number {
    const optimalRanges = [
      { start: 0.3, end: 0.45, score: 90 }, // Morning peak
      { start: 0.6, end: 0.75, score: 100 }, // Afternoon peak
      { start: 0.8, end: 0.9, score: 80 }, // Evening work
    ];

    for (const range of optimalRanges) {
      if (dayProgress >= range.start && dayProgress <= range.end) {
        return range.score;
      }
    }

    return 70; // Base score for other times
  }

  static predictFlowTrend(metrics: ActivityMetrics[]): FlowTrendPrediction {
    if (metrics.length < 2) return "stable";

    const recentScores = metrics
      .slice(-3)
      .map((m) => this.calculateFlowScore(m));
    const trend = recentScores[recentScores.length - 1] - recentScores[0];

    if (trend > 10) return "improving";
    if (trend < -10) return "declining";
    return "stable";
  }

  static createFlowState(
    userId: string,
    metrics: ActivityMetrics
  ): Omit<FlowState, "lastUpdated"> {
    const score = this.calculateFlowScore(metrics);
    const status = this.determineFlowStatus(score, metrics);

    return {
      userId,
      score,
      status,
      activeTime: metrics.activeTime,
    };
  }
}

type FlowTrendPrediction = "improving" | "declining" | "stable";
