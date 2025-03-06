'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, ArrowRightCircle } from 'lucide-react';
import { useFlowContext } from '@/context/FlowContext';
import { TaskFlowService, Task } from '@/services/taskFlow';
import styles from './TaskItem.module.css';

interface TaskItemProps {
  task: Task & { successProbability?: number };
  isActive?: boolean;
  onSelect?: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isActive,
  onSelect,
  onComplete
}) => {
  const { flowState } = useFlowContext();

  const flowMetrics = useMemo(() => {
    const probability = task.successProbability ?? 
      TaskFlowService.predictTaskSuccess(task, flowState);
    
    return {
      isOptimal: flowState.status === 'peak' || flowState.status === 'flow',
      probability,
      contextWarning: !isActive && task.contextCost > 0.3,
      breakNeeded: TaskFlowService.suggestBreak(flowState)
    };
  }, [task, flowState, isActive]);

  const handleSelect = () => {
    if (onSelect && !task.completed) {
      onSelect(task.id);
    }
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onComplete && !task.completed) {
      onComplete(task.id);
    }
  };

  return (
    <motion.div
      className={`
        ${styles.taskItem}
        ${isActive ? styles.active : ''}
        ${task.completed ? styles.completed : ''}
        ${flowMetrics.isOptimal ? styles.optimal : ''}
      `}
      onClick={handleSelect}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        {!task.completed && (
          <motion.button
            className={styles.completeButton}
            onClick={handleComplete}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <CheckCircle className={styles.icon} />
          </motion.button>
        )}
      </div>

      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span>Est. Duration</span>
          <span>{task.estimatedDuration}m</span>
        </div>

        <div className={styles.metric}>
          <span>Success Rate</span>
          <span className={`
            ${flowMetrics.probability >= 0.7 ? styles.high : ''}
            ${flowMetrics.probability < 0.7 && flowMetrics.probability >= 0.4 ? styles.medium : ''}
            ${flowMetrics.probability < 0.4 ? styles.low : ''}
          `}>
            {Math.round(flowMetrics.probability * 100)}%
          </span>
        </div>

        {!isActive && flowMetrics.contextWarning && (
          <div className={styles.warning}>
            <AlertCircle className={styles.icon} />
            <span>High context switch cost</span>
          </div>
        )}
      </div>

      {flowMetrics.breakNeeded && isActive && (
        <div className={styles.breakSuggestion}>
          <AlertCircle className={styles.icon} />
          <span>Break recommended before continuing</span>
        </div>
      )}

      {isActive && (
        <motion.div 
          className={styles.flowStatus}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        >
          <div className={styles.statusIndicator}>
            <ArrowRightCircle className={styles.icon} />
            <span>In Progress</span>
          </div>
          <div className={styles.flowScore}>
            Flow Score: {flowState.score}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TaskItem;
