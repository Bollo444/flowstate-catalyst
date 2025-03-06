// src/components/team/MetricCard.tsx
import React from 'react';
import styles from './MetricCard.module.css'; // Create MetricCard.module.css

interface MetricCardProps {
  title: string;
  value: number | string;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend }) => {
  const trendIndicator = trend ? (trend.direction === 'up' ? '↑' : '↓') + ` ${trend.percentage}%` : '';
  return (
    <div className={styles.metricCard}>
      <h4>{title}</h4>
      <div className={styles.metricValue}>{value}</div>
      {trend && (
        <div className={`${styles.trend} ${styles[trend.direction]}`}>
          {trendIndicator}
        </div>
      )}
    </div>
  );
};

export default MetricCard;