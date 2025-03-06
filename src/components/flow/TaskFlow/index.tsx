'use client';

import React from 'react';
import { useTaskRouting } from '../../../context/TaskRoutingContext';
import { useFlowContext } from '../../../context/FlowContext';
import { LoadingSpinner } from '../../shared/LoadingSpinner';
import { Task } from '../../../types/database';
import { TaskRoutingResult } from '../../../features/taskFlow/types';
import styles from './styles.module.css';

interface TaskItemProps {
  task: Task;
  isActive?: boolean;
  flowScore: number;
  onSelect: (taskId: string) => void;
}

function TaskItem({ task, isActive, flowScore, onSelect }: TaskItemProps) {
  const flowIndicatorStyle = {
    '--flow-score': `${flowScore}%`
  } as React.CSSProperties;

  return (
    <div 
      className={`${styles.taskItem} ${isActive ? styles.active : ''}`}
      onClick={() => onSelect(task.id)}
      data-testid={`task-item-${task.id}`}
    >
      <div className={styles.taskContent}>
        <h3 className={styles.taskTitle}>{task.title}</h3>
        <p className={styles.taskDescription}>{task.description}</p>
        {task.due_date && (
          <div className={styles.taskDueDate}>
            Due: {new Date(task.due_date).toLocaleDateString()}
          </div>
        )}
      </div>
      <div 
        className={styles.flowIndicator} 
        style={flowIndicatorStyle}
        title={`Flow alignment: ${Math.round(flowScore)}%`}
      />
    </div>
  );
}

export function TaskFlow() {
  const { 
    currentSequence, 
    routingResult,
    startNextTask,
    isRouting
  } = useTaskRouting();
  
  const { flowState } = useFlowContext();

  if (isRouting) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="medium" />
        <p>Optimizing task sequence...</p>
      </div>
    );
  }

  if (!currentSequence.length) {
    return (
      <div className={styles.emptyState}>
        <h2>No Tasks Available</h2>
        <p>Add some tasks to get started with flow-optimized work.</p>
      </div>
    );
  }

  // Calculate flow scores for tasks based on their position in the sequence
  const calculateTaskFlowScore = (index: number, total: number): number => {
    if (!routingResult) return 0;
    const baseScore = routingResult.routingFactors.flowAlignment * 100;
    const positionFactor = 1 - (index / total * 0.5); // Earlier tasks get higher scores
    return baseScore * positionFactor;
  };

  return (
    <div className={styles.container} data-testid="task-flow">
      <div className={styles.taskList}>
        {currentSequence.map((task, index) => {
          const flowScore = calculateTaskFlowScore(index, currentSequence.length);
          const isActive = index === 0;

          return (
            <TaskItem
              key={task.id}
              task={task}
              isActive={isActive}
              flowScore={flowScore}
              onSelect={() => startNextTask()}
            />
          );
        })}
      </div>
      
      {flowState && routingResult && (
        <div className={styles.flowInfo}>
          <div className={styles.flowMetric}>
            <span>Current Flow Score</span>
            <strong>{flowState.score}%</strong>
          </div>
          <div className={styles.flowMetric}>
            <span>Task Alignment</span>
            <strong>
              {Math.round(routingResult.routingFactors.flowAlignment * 100)}%
            </strong>
          </div>
        </div>
      )}
    </div>
  );
}