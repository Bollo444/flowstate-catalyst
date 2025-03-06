import React from 'react';
import styles from './styles.module.css';
import { getColorClass } from './utils';
import type { FlowScoreProps } from './FlowScore.types';

const FlowScore: React.FC<FlowScoreProps> = ({
  score,
  label = 'Flow Score',
  size = 'medium',
  showLabel = true,
  className = '',
  colorState,
  flowState,
  ...props
}) => {
  const scoreValue = Math.round(score);
  const sizeClass = styles[size];
  const colorClassName = styles[colorState];

  return (
    <div 
      {...props}
      className={`${styles.container} ${sizeClass} ${className}`} 
      data-flowstate={flowState}
      data-testid="flow-score-container"
    >
      {showLabel && <div className={styles.label}>{label}</div>}
      <div className={`${styles.score} ${colorClassName}`} data-testid="flow-score-value">
        {scoreValue}%
      </div>
      <div className={`${styles.ring} ${colorClassName}`}>
        <svg viewBox="0 0 100 100">
          <circle
            className={styles.background}
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="5"
          />
          <circle
            className={styles.progress}
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="5"
            strokeDasharray={`${score * 2.83}, 283`}
            transform="rotate(-90 50 50)"
            style={{ stroke: getColorClass(colorState) }}
          />
        </svg>
      </div>
      {flowState && (
        <div className={styles.flowState} data-testid="flow-state">
          {flowState}
        </div>
      )}
    </div>
  );
};

FlowScore.displayName = 'FlowScore';

export { FlowScore };
export type { FlowScoreProps };
export * from './FlowScore.types';