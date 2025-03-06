import React from 'react';
import styles from './Analytics.module.css';

interface ChartData {
  time?: string;
  day?: string;
  score?: number;
  completed?: number;
  optimal?: number;
}

interface SimpleChartProps {
  data: ChartData[];
  type: 'line' | 'bar';
  height?: number;
  title: string;
}

export const SimpleChart: React.FC<SimpleChartProps> = ({
  data,
  type,
  height = 300,
  title
}) => {
  const maxValue = Math.max(
    ...data.map(d => Math.max(
      d.score || 0,
      d.completed || 0,
      d.optimal || 0
    ))
  );

  return (
    <div className={styles.simpleChart} style={{ height }}>
      <h3>{title}</h3>
      <div className={styles.chartContainer}>
        {type === 'line' && (
          <svg width="100%" height={height - 50}>
            <polyline
              points={data
                .map((d, i) => `${(i * 100) / (data.length - 1)},${
                  height - 70 - ((d.score || 0) * (height - 70)) / maxValue
                }`
                )
                .join(' ')}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
            />
          </svg>
        )}
        {type === 'bar' && (
          <div className={styles.barChart}>
            {data.map((d, i) => (
              <div key={i} className={styles.barGroup}>
                {d.completed !== undefined && (
                  <div
                    className={styles.bar}
                    style={{
                      height: `${(d.completed * (height - 70)) / maxValue}px`,
                      backgroundColor: '#3B82F6'
                    }}
                  />
                )}
                {d.optimal !== undefined && (
                  <div
                    className={styles.bar}
                    style={{
                      height: `${(d.optimal * (height - 70)) / maxValue}px`,
                      backgroundColor: '#50B584'
                    }}
                  />
                )}
                <div className={styles.barLabel}>{d.day}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleChart;
