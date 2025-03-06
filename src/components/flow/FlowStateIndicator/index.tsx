import React, { useState, useEffect } from 'react';
import { FlowState, FlowMetrics } from '../../../hooks/useFlowState';
import styles from './styles.module.css';

interface FlowStateIndicatorProps {
  flowState: FlowState;
  metrics: FlowMetrics | null;
  onInterrupt?: () => void;
}

export const FlowStateIndicator: React.FC<FlowStateIndicatorProps> = ({
  flowState,
  metrics,
  onInterrupt
}) => {
  const [timeInState, setTimeInState] = useState(0);

  useEffect(() => {
    if (flowState.sessionStart) {
      const interval = setInterval(() => {
        const now = new Date();
        const start = flowState.sessionStart as Date;
        setTimeInState(Math.floor((now.getTime() - start.getTime()) / 60000));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [flowState.sessionStart]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStatusColor = () => {
    switch (flowState.status) {
      case 'flowing':
        return '#4CAF50';
      case 'starting':
        return '#FFAA4C';
      case 'interrupted':
        return '#FF4C4C';
      case 'cooling_down':
        return '#4A9EFF';
      default:
        return '#808080';
    }
  };

  const getStatusText = () => {
    switch (flowState.status) {
      case 'flowing':
        return 'In Flow';
      case 'starting':
        return 'Getting Started';
      case 'interrupted':
        return 'Interrupted';
      case 'cooling_down':
        return 'Cooling Down';
      default:
        return 'Inactive';
    }
  };

  const getIntensityDescription = () => {
    if (flowState.intensity <= 3) return 'Low';
    if (flowState.intensity <= 6) return 'Moderate';
    if (flowState.intensity <= 8) return 'High';
    return 'Peak';
  };

  const getOptimalTimeMessage = () => {
    if (!metrics?.optimalTimeRanges.length) return null;

    const now = new Date();
    const currentHour = now.getHours();
    const isOptimal = metrics.optimalTimeRanges.some(
      range => currentHour >= range.start && currentHour <= range.end
    );

    if (isOptimal) {
      return {
        type: 'optimal',
        message: 'This is your optimal work time! Make the most of it.'
      };
    }

    // Find next optimal time range
    const nextRange = metrics.optimalTimeRanges.find(range => range.start > currentHour);
    if (nextRange) {
      const hoursUntil = nextRange.start - currentHour;
      return {
        type: 'upcoming',
        message: `Optimal work time in ${hoursUntil} hour${hoursUntil > 1 ? 's' : ''}`
      };
    }

    // If no upcoming range today, show first range of next day
    const firstRange = metrics.optimalTimeRanges[0];
    const hoursUntil = (24 - currentHour) + firstRange.start;
    return {
      type: 'next-day',
      message: `Next optimal work time tomorrow at ${firstRange.start}:00`
    };
  };

  const optimalTimeInfo = getOptimalTimeMessage();

  return (
    <div className={styles.container}>
      <div 
        className={`${styles.indicator} ${styles[flowState.status]}`}
        style={{ '--status-color': getStatusColor() } as React.CSSProperties}
      >
        <div className={styles.statusRing}>
          <svg viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray={`${flowState.score * 2.83} 283`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          
          <div className={styles.statusContent}>
            <div className={styles.score}>{Math.round(flowState.score)}</div>
            <div className={styles.status}>{getStatusText()}</div>
          </div>
        </div>

        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span className={styles.label}>Duration</span>
            <span className={styles.value}>{formatDuration(timeInState)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>Intensity</span>
            <span className={styles.value}>{getIntensityDescription()}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>Interruptions</span>
            <span className={styles.value}>{flowState.interruptions}</span>
          </div>
        </div>
      </div>

      {optimalTimeInfo && (
        <div className={`${styles.optimalTime} ${styles[optimalTimeInfo.type]}`}>
          <svg viewBox="0 0 24 24" className={styles.icon}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
          <span>{optimalTimeInfo.message}</span>
        </div>
      )}

      {flowState.status === 'flowing' && onInterrupt && (
        <button
          className={styles.interruptButton}
          onClick={onInterrupt}
        >
          Record Interruption
        </button>
      )}
    </div>
  );
};