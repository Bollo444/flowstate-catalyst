/**
 * FlowScore Component Types
 */

// Size options for the flow score display
export type FlowScoreSize = 'tiny' | 'small' | 'medium' | 'large';

// Color states for different score ranges
export type FlowScoreColorState = 'excellent' | 'good' | 'moderate' | 'poor' | 'critical';

// Flow states indicating the current flow phase
export type FlowState = 'peak' | 'flow' | 'rest' | 'building';

export interface BaseScoreProps {
  /** The numerical score value (0-100) */
  score: number;
  /** Optional label to display above the score */
  label?: string;
  /** Size variant of the score display */
  size?: FlowScoreSize;
  /** Whether to show the label */
  showLabel?: boolean;
  /** Additional CSS class names */
  className?: string;
}

export interface FlowScoreProps extends BaseScoreProps {
  /** Current color state based on score */
  colorState: FlowScoreColorState;
  /** Current flow state (optional) */
  flowState?: FlowState;
}

// Theme configuration
export interface FlowScoreTheme {
  colors?: Record<FlowScoreColorState, string>;
  background?: string;
  text?: string;
}

// Animation configuration
export interface FlowScoreAnimation {
  duration?: number;
  ease?: string;
  delay?: number;
}