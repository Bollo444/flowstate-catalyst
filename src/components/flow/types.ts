/**
 * Flow Component Types
 */

// Score display sizes
export type FlowScoreSize = 'tiny' | 'small' | 'medium' | 'large';

// Score color states
export type FlowScoreColorState = 'excellent' | 'good' | 'moderate' | 'poor' | 'critical';

// Flow states
export type FlowState = 'peak' | 'flow' | 'rest' | 'building';

// Props for the FlowScore component
export interface FlowScoreProps {
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
  /** Additional CSS class names */
  className?: string;
}

// Re-export all Flow types
export * from './FlowScore/FlowScore.types';