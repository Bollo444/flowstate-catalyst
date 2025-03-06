'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFlowContext } from '@/context/FlowContext';
import { TaskAnalytics } from '@/components/metrics/TaskAnalytics';
import { TimeRangeOption } from '@/types/analytics';
import styles from './analytics.module.css';

export default function AnalyticsPage() {
  const { flowState } = useFlowContext();
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('week');

  if (!flowState.userId) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner} />
        <span>Loading analytics...</span>
      </div>
    );
  }

  const timeRangeOptions: { value: TimeRangeOption; label: string }[] = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ];

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Flow Analytics</h1>
          <p>Track your productivity and flow state patterns</p>
        </div>

        <div className={styles.controls}>
          <div className={styles.timeRange}>
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                className={`${styles.timeRangeButton} ${
                  timeRange === option.value ? styles.active : ''
                }`}
                onClick={() => setTimeRange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className={styles.content}>
        <TaskAnalytics
          userId={flowState.userId}
          timeRange={timeRange}
        />
      </main>

      <footer className={styles.footer}>
        <p className={styles.hint}>
          Pro tip: Use these insights to optimize your daily schedule around your peak flow states.
        </p>
      </footer>
    </motion.div>
  );
}
