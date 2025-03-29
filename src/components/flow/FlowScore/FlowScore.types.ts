import { HTMLAttributes } from "react";

// Score display sizes
export type FlowScoreSize = "tiny" | "small" | "medium" | "large";

// Score color states
export type FlowScoreColorState =
  | "excellent"
  | "good"
  | "moderate"
  | "poor"
  | "critical";

// Flow states
export type FlowState = "peak" | "flow" | "rest" | "building";

// Base props for FlowScore component
export interface FlowScoreBaseProps {
  /** The numerical score value (0-100) */
  score: number;
  /** Current color state based on score */
  colorState: FlowScoreColorState;
  /** Current flow state */
  flowState?: FlowState;
  /** Size variant */
  size?: FlowScoreSize;
  /** Optional label text */
  label?: string;
  /** Whether to show the label */
  showLabel?: boolean;
}

// Full props including HTML attributes
export type FlowScoreProps = FlowScoreBaseProps &
  HTMLAttributes<HTMLDivElement>;

// Re-export for convenience
export default FlowScoreProps;
