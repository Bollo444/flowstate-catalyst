import type { FlowScoreColorState, FlowState } from "./FlowScore.types";

export function getColorStateFromScore(score: number): FlowScoreColorState {
  if (score >= 90) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "moderate";
  if (score >= 30) return "poor";
  return "critical";
}

export function getFlowStateFromScore(score: number): FlowState {
  if (score >= 90) return "peak";
  if (score >= 70) return "flow";
  if (score >= 50) return "building";
  return "rest";
}

export function getColorClass(state: FlowScoreColorState): string {
  const colors = {
    excellent: "var(--success)",
    good: "var(--success-muted)",
    moderate: "var(--warning)",
    poor: "var(--warning-muted)",
    critical: "var(--error)",
  };
  return colors[state];
}
