'use client';

import React, { useState } from 'react';
import { Task } from '@/services/taskFlow';
import { FlowState } from '@/types/flow';
import { useFlowTasks } from '@/hooks/useFlowTasks';
import { useTaskSelection } from '@/context/TaskSelectionContext';
import { useToast } from '@/components/ui/use-toast';
import { TaskForm } from '../TaskForm';
import { TaskDependencyManager } from '../TaskDependencyManager';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { ProgressUpdateModal } from '../ProgressUpdateModal';
import { ProgressHistory } from '../ProgressHistory';
import { Zap, AlertTriangle } from 'lucide-react';
import styles from './styles.module.css';

interface TaskCardProps {
  task: Task;
  flowState: FlowState;
  onUpdate?: () => void;
  projectTasks?: Task[];
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  flowState,
  onUpdate,
  projectTasks = []
}) => {
  const { updateTask } = useFlowTasks({ userId: task.userId });
  const { isSelected, toggleTask } = useTaskSelection();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDependencies, setShowDependencies] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showProgressHistory, setShowProgressHistory] = useState(false);

  const getDependencyCount = () => task.dependencies?.length ?? 0;

  const canTransitionStatus = () => {
    if (task.dependencies && task.dependencies.length > 0) {
      const uncompletedDependencies = projectTasks
        .filter(t => task.dependencies?.includes(t.id))
        .filter(t => t.status !== 'completed');
      
      return uncompletedDependencies.length === 0;
    }
    return true;
  };

  const handleProgressUpdate = async (progress: number, note: string) => {
    try {
      const updates: Partial<Task> = {
        progress,
        completionMetrics: {
          ...task.completionMetrics,
          lastNote: note,
          lastUpdate: new Date().toISOString()
        }
      };

      // If progress is 100%, mark as completed
      if (progress === 100) {
        updates.status = 'completed';
      }

      await updateTask(task.id, updates);
      onUpdate?.();
      
      toast({
        title: 'Progress updated',
        description: 'Task progress has been saved successfully.'
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      toast({
        title: 'Update failed',
        description: 'Could not update task progress.',
        variant: 'destructive'
      });
    }
  };

  const handleStatusChange = async () => {
    if (!canTransitionStatus()) {
      toast({
        title: 'Cannot update status',
        description: 'This task has uncompleted dependencies.',
        variant: 'destructive'
      });
      return;
    }

    setIsUpdating(true);
    try {
      const newStatus = task.status === 'active' ? 'completed' : 'archived';
      await updateTask(task.id, { status: newStatus });
      onUpdate?.();
      
      toast({
        title: 'Status updated',
        description: `Task marked as ${newStatus}.`
      });
    } catch (error) {
      console.error('Failed to update task status:', error);
      toast({
        title: 'Update failed',
        description: 'Could not update task status.',
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isEditing) {
    return (
      <TaskForm
        projectId={task.projectId || ''}
        userId={task.userId}
        teamId={task.teamId}
        initialData={task}
        onSubmit={async (updates) => {
          try {
            await updateTask(task.id, updates);
            setIsEditing(false);
            onUpdate?.();
            toast({
              title: 'Task updated',
              description: 'Changes have been saved successfully.'
            });
          } catch (error) {
            console.error('Failed to update task:', error);
            toast({
              title: 'Update failed',
              description: 'Could not save changes.',
              variant: 'destructive'
            });
          }
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  const selected = isSelected(task.id);
  const dependencyCount = getDependencyCount();
  const hasDependencies = dependencyCount > 0;
  const dependenciesCompleted = hasDependencies && canTransitionStatus();
  const isContextSwitchHigh = task.contextCost > 0.3;

  const getPriorityLabel = (priority: number) => {
    if (priority >= 67) return 'High';
    if (priority >= 34) return 'Medium';
    return 'Low';
  };

  return (
    <>
      <div 
        className={`${styles.taskCard} ${styles[`status${task.status}`]} ${selected ? styles.selected : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains(styles.taskCard)) {
            toggleTask(task.id);
          }
        }}
      >
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <input
              type="checkbox"
              checked={selected}
              onChange={() => toggleTask(task.id)}
              className={styles.checkbox}
              onClick={(e) => e.stopPropagation()}
            />
            <h3>{task.title}</h3>
            {task.flowOptimal && (
              <Zap className={styles.flowOptimalIcon} />
            )}
          </div>
          <div className={styles.metrics}>
            <span className={`${styles.priority} ${styles[`priority${getPriorityLabel(task.priority)}`]}`}>
              {getPriorityLabel(task.priority)}
            </span>
            {isContextSwitchHigh && (
              <div className={styles.contextWarning}>
                <AlertTriangle className={styles.icon} />
                <span>High context switch</span>
              </div>
            )}
          </div>
        </div>

        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}

        <div className={styles.progressSection}>
          <div className={styles.progressInfo}>
            <div className={styles.progressBar} onClick={() => setShowProgressModal(true)}>
              <ProgressBar
                progress={task.progress || 0}
                size="medium"
                showPercentage
                type={task.flowOptimal ? 'flow' : 'default'}
              />
            </div>
            <button
              className={styles.historyButton}
              onClick={() => setShowProgressHistory(true)}
              title="View progress history"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 8v4l3 3" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </button>
          </div>
          {task.completionMetrics?.lastNote && (
            <p className={styles.progressNote}>{task.completionMetrics.lastNote}</p>
          )}
        </div>

        <div className={styles.meta}>
          <div className={styles.status}>
            Status: <span>{task.status}</span>
            {hasDependencies && (
              <span className={`${styles.dependencyIndicator} ${dependenciesCompleted ? styles.completed : ''}`}>
                {dependenciesCompleted ? '✓ Dependencies met' : '⚠ Has dependencies'}
              </span>
            )}
          </div>
          {task.dueDate && (
            <div className={styles.dueDate}>
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
          <div className={styles.duration}>
            Est. Duration: {task.estimatedDuration}m
          </div>
        </div>

        <div className={styles.actions}>
          {task.status === 'active' && (
            <>
              <button 
                className={styles.actionButton}
                onClick={handleStatusChange}
                disabled={isUpdating || (hasDependencies && !dependenciesCompleted)}
                title={hasDependencies && !dependenciesCompleted ? 'Complete dependencies first' : ''}
              >
                {isUpdating ? 'Updating...' : 'Complete Task'}
              </button>
              <button 
                className={`${styles.actionButton} ${styles.editButton}`}
                onClick={() => setIsEditing(true)}
                disabled={isUpdating}
              >
                Edit
              </button>
            </>
          )}

          <button
            className={`${styles.actionButton} ${styles.dependenciesButton} ${showDependencies ? styles.active : ''}`}
            onClick={() => setShowDependencies(!showDependencies)}
          >
            Dependencies {hasDependencies ? `(${dependencyCount})` : ''}
          </button>
        </div>

        {showDependencies && projectTasks.length > 0 && (
          <TaskDependencyManager
            task={task}
            projectTasks={projectTasks}
            onUpdate={onUpdate || (() => {})}
          />
        )}
      </div>

      <ProgressUpdateModal
        open={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        task={task}
        onUpdate={handleProgressUpdate}
      />

      <ProgressHistory
        taskId={task.id}
        open={showProgressHistory}
        onClose={() => setShowProgressHistory(false)}
      />
    </>
  );
};

export default TaskCard;
