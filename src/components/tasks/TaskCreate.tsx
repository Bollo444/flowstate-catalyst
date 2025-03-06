'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import { useFlowContext } from '@/context/FlowContext';
import { useFlowTasks } from '@/hooks/useFlowTasks';
import { TaskFlowService, CreateTaskInput, DEFAULT_TASK_VALUES } from '@/services/taskFlow';
import { useToast } from '@/components/ui/use-toast';
import styles from './Task.module.css';


interface TaskCreateProps {
  userId: string;
  teamId?: string;
  onCreated?: () => void;
}

export const TaskCreate: React.FC<TaskCreateProps> = ({
  userId,
  teamId,
  onCreated
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState(30);
  const { flowState } = useFlowContext();
  const { createTask } = useFlowTasks({ userId, teamId });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const contextCost = TaskFlowService.calculateContextSwitch(
        '', // No previous task
        'new',
        flowState
      );

      const newTask: CreateTaskInput = {
        title,
        description,
        estimatedDuration,
        userId,
        teamId,
        contextCost,
        priority: DEFAULT_TASK_VALUES.priority,
        flowOptimal: DEFAULT_TASK_VALUES.flowOptimal,
        status: DEFAULT_TASK_VALUES.status
      };

      await createTask(newTask);
      setTitle('');
      setDescription('');
      setEstimatedDuration(30);
      setIsExpanded(false);
      onCreated?.();

    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error creating task',
        description: 'Please try again later',
        variant: 'destructive'
      });
    }
  };

  const getFlowAdvice = useCallback(() => {
    if (flowState.status === 'peak') {
      return {
        message: 'Consider shorter tasks to maintain peak flow',
        type: 'warning' as const
      };
    }
    if (flowState.status === 'flow') {
      return {
        message: 'Good time to plan next tasks',
        type: 'success' as const
      };
    }
    if (flowState.status === 'rest') {
      return {
        message: 'Good time for task planning and organization',
        type: 'info' as const
      };
    }
    return {
      message: 'Building focus - keep tasks manageable',
      type: 'info' as const
    };
  }, [flowState.status]);

  const advice = getFlowAdvice();

  return (
    <motion.div 
      className={styles.taskCreate}
      initial={false}
      animate={{ height: isExpanded ? 'auto' : '48px' }}
    >
      {!isExpanded ? (
        <button
          className={styles.createButton}
          onClick={() => setIsExpanded(true)}
        >
          <Plus className={styles.icon} />
          <span>Create New Task</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className={styles.createForm}>
          <div className={styles.header}>
            <h3>Create New Task</h3>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setIsExpanded(false)}
            >
              ✕
            </button>
          </div>

          <div className={styles.advice} data-type={advice.type}>
            <AlertCircle className={styles.icon} />
            <span>{advice.message}</span>
          </div>

          <div className={styles.field}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description (optional)"
              rows={3}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="duration">
              <Clock className={styles.icon} />
              Estimated Duration (minutes)
            </label>
            <input
              id="duration"
              type="number"
              min={5}
              max={180}
              step={5}
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(Number(e.target.value))}
              required
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setIsExpanded(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!title || estimatedDuration < 5}
            >
              Create Task
              <ArrowRight className={styles.icon} />
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default TaskCreate;
