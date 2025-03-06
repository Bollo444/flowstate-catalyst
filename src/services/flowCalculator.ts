/**
 * Flow score calculation service that determines flow state based on various factors:
 * - Active time (duration of focused work)
 * - Task completion rate
 * - Break intervals
 * - Context switching
 * - Time of day patterns
 */

import { FlowStatus } from '../types/supabase';
import { FlowState, ActivityMetrics } from '../types/flow';

const FLOW_THRESHOLDS = {
  ACTIVE_TIME_MIN: 25,        // Minimum time needed to enter flow (25 min)
  ACTIVE_TIME_MAX: 90,        // Maximum recommended flow time (90 min)
  BREAK_INTERVAL: 45,         // Recommended break interval (45 min)
  CONTEXT_SWITCH_PENALTY: 15, // Score penalty for excessive context switching
  TASK_COMPLETION_BONUS: 10,  // Score bonus for completing tasks
};

export class FlowCalculator {
  /**
   * Calculate flow score based on various metrics
   */
  static calculateFlowScore(metrics: ActivityMetrics): number {
    let score = 50; // Base score

    // Active time factor
    score += this.calculateActiveTimeFactor(metrics.activeTime);
    
    // Task completion bonus
    score += metrics.taskCompletions * FLOW_THRESHOLDS.TASK_COMPLETION_BONUS;
    
    // Context switching penalty
    score -= metrics.contextSwitches * FLOW_THRESHOLDS.CONTEXT_SWITCH_PENALTY;
    
    // Break timing factor
    score += this.calculateBreakFactor(metrics.lastBreakTime, metrics.activeTime);
    
    // Time of day optimization
    score += this.calculateTimeOptimization(metrics.dayProgress);

    // Ensure score stays within 0-100 range
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Determine flow status based on score and metrics
   */
  static determineFlowStatus(score: number, metrics: ActivityMetrics): FlowStatus {
    if (score >= 80 && metrics.activeTime >= FLOW_THRESHOLDS.ACTIVE_TIME_MIN) {
      return 'peak';
    } else if (score >= 60) {
      return 'flow';
    } else if (metrics.activeTime < FLOW_THRESHOLDS.ACTIVE_TIME_MIN) {
      return 'building';
    } else {
      return 'rest';
    }
  }

  private static calculateActiveTimeFactor(activeTime: number): number {
    if (activeTime < FLOW_THRESHOLDS.ACTIVE_TIME_MIN) {
      // Ramping up phase
      return (activeTime / FLOW_THRESHOLDS.ACTIVE_TIME_MIN) * 20;
    } else if (activeTime > FLOW_THRESHOLDS.ACTIVE_TIME_MAX) {
      // Diminishing returns after max time
      const overtime = activeTime - FLOW_THRESHOLDS.ACTIVE_TIME_MAX;
      return 20 - (overtime / 30) * 10; // Decrease score after max time
    } else {
      // Optimal flow period
      return 20;
    }
  }

  private static calculateBreakFactor(lastBreakTime: Date | undefined, activeTime: number): number {
    if (!lastBreakTime) return 0;

    const timeSinceBreak = (Date.now() - lastBreakTime.getTime()) / (1000 * 60); // Convert to minutes
    
    if (timeSinceBreak > FLOW_THRESHOLDS.BREAK_INTERVAL) {
      // Penalty for working too long without a break
      const overdue = timeSinceBreak - FLOW_THRESHOLDS.BREAK_INTERVAL;
      return -Math.min(20, overdue / 15 * 10);
    }
    
    return Math.min(10, (timeSinceBreak / FLOW_THRESHOLDS.BREAK_INTERVAL) * 10);
  }

  private static calculateTimeOptimization(dayProgress: number): number {
    // Assume optimal productivity during middle of day (0.3-0.7 progress)
    if (dayProgress > 0.3 && dayProgress < 0.7) {
      return 10;
    } else if (dayProgress < 0.2 || dayProgress > 0.8) {
      return -5; // Early morning or late evening penalty
    }
    return 0;
  }

  /**
   * Create flow state update based on current metrics
   */
  static createFlowState(userId: string, metrics: ActivityMetrics): Omit<FlowState, 'lastUpdated'> {
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
