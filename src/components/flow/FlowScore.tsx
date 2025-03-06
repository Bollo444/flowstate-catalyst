'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlowStatus } from '@/types/supabase';
import { ActivityMetrics } from '@/types/flow';
import styles from './FlowScore.module.css';

interface FlowScoreProps {
  score: number;
  status: FlowStatus;
  metrics: ActivityMetrics;
  showDetails?: boolean;
}

const statusColors = {
  peak: '#50B584',    // Bright green for peak performance
  flow: '#3B82F6',    // Blue for steady flow
  rest: '#8B5CF6',    // Purple for rest phase
  building: '#F59E0B' // Orange for building phase
};

const statusDescriptions = {
  peak: 'Peak performance! You\'re in an optimal flow state.',
  flow: 'You\'re in flow. Keep the momentum going!',
  rest: 'Time to recharge. Take a short break.',
  building: 'Building focus. Minimize distractions.'
};

export const FlowScore: React.FC<FlowScoreProps> = ({ 
  score, 
  status, 
  metrics, 
  showDetails = false 
}) => {
  return (
    <motion.div 
      className={styles.flowScore}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.scoreContainer}>
        <motion.div 
          className={styles.scoreCircle}
          style={{ 
            backgroundColor: statusColors[status],
            opacity: score / 100,
          }}
          animate={{
            boxShadow: `0 0 ${status === 'peak' ? '2px' : '1px'} ${statusColors[status]}`
          }}
        >
          <motion.div 
            className={styles.score}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {score}
          </motion.div>
        </motion.div>
        <div className={styles.label}>Flow Score</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={status}
          className={`${styles.status} ${styles[status]}`}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </motion.div>
      </AnimatePresence>

      {showDetails && (
        <motion.div 
          className={styles.details}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className={styles.description}>{statusDescriptions[status]}</p>
          <div className={styles.metrics}>
            <div className={styles.metric}>
              <span>Active Time</span>
              <span>{Math.floor(metrics.activeTime)}m</span>
            </div>
            <div className={styles.metric}>
              <span>Tasks Done</span>
              <span>{metrics.taskCompletions}</span>
            </div>
            <div className={styles.metric}>
              <span>Last Break</span>
              <span>
                {metrics.lastBreakTime 
                  ? `${Math.floor((Date.now() - metrics.lastBreakTime.getTime()) / 60000)}m ago`
                  : 'N/A'
                }
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FlowScore;
