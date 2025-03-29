'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useFlowTasks } from '@/hooks/useFlowTasks';
import { useTaskSelection } from '@/context/TaskSelectionContext';
import { useToast } from '@/components/ui/use-toast';
import { TaskForm } from '../TaskForm';
import { TaskDependencyManager } from '../TaskDependencyManager';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { ProgressUpdateModal } from '../ProgressUpdateModal';
import { ProgressHistory } from '../ProgressHistory';
import { Zap, AlertTriangle, Clock, History, CheckCircle as CheckIcon } from 'lucide-react';
import { Task, TaskStatus, Profile, FlowState as DbFlowState } from '@/types/database';
import clsx from 'clsx';

interface TaskCardProps {
  task: Task;
  onUpdate?: () => void;
  projectTasks?: Task[];
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdate,
  projectTasks = []
}) => {
  const { deleteTask: deleteTaskFn, updateTask } = useFlowTasks({ userId: task.user_id });
  const { isSelected, toggleTask } = useTaskSelection();

  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDependencies, setShowDependencies] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showProgressHistory, setShowProgressHistory] = useState(false);

  // Dependency logic placeholder
  const getDependencyCount = () => 0;
  const canTransitionStatus = useCallback(() => true, []);
  const dependenciesCompleted = useMemo(() => canTransitionStatus(), [canTransitionStatus]);

  const handleProgressUpdate = useCallback(async (progress: number, note: string) => {
    try {
      const updates: Partial<Task> = {
        completion_metrics: { ...(task.completion_metrics || {}), lastNote: note, lastUpdate: new Date().toISOString() }
      };
      if (progress === 100) updates.status = 'completed';
      await updateTask(task.id, updates);
      onUpdate?.();
      toast({ title: 'Progress updated', description: 'Task progress saved.' });
    } catch (error) {
      console.error('Failed to update task:', error);
      toast({ title: 'Update failed', description: 'Could not update progress.', variant: 'destructive' });
    }
  }, [task, updateTask, onUpdate, toast]);

  const handleStatusChange = useCallback(async () => {
    if (!canTransitionStatus()) {
      toast({ title: 'Cannot update status', description: 'Complete dependencies first.', variant: 'destructive' });
      return;
    }
    setIsUpdating(true);
    try {
      const newStatus: TaskStatus = task.status === 'active' ? 'completed' : 'active';
      await updateTask(task.id, { status: newStatus });
      onUpdate?.();
      toast({ title: 'Status updated', description: `Task marked as ${newStatus}.` });
    } catch (error) {
      console.error('Failed to update task status:', error);
      toast({ title: 'Update failed', description: 'Could not update status.', variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  }, [canTransitionStatus, task, updateTask, onUpdate, toast]);

  const handleDelete = useCallback(async (taskId: string) => {
    try {
      await deleteTaskFn(taskId);
      onUpdate?.();
      toast({ title: 'Task deleted', description: 'Task deleted successfully.' });
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast({ title: 'Delete failed', description: 'Could not delete task.', variant: 'destructive' });
    }
  }, [deleteTaskFn, onUpdate, toast]);

  if (isEditing) {
    return (
      <TaskForm
        projectId={task?.project_id || ''}
        userId={task.user_id}
        teamId={task?.team_id ?? undefined} // Corrected: Pass undefined if team_id is null
        initialData={task}
        onSubmit={async (updates) => {
          try {
            await updateTask(task.id, updates);
            setIsEditing(false);
            onUpdate?.();
            toast({ title: 'Task updated', description: 'Changes saved.' });
          } catch (error) {
            console.error('Failed to update task:', error);
            toast({ title: 'Update failed', description: 'Could not save changes.', variant: 'destructive' });
          }
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  const selected = isSelected(task.id);
  const dependencyCount = getDependencyCount();
  const hasDependencies = dependencyCount > 0;
  const isContextSwitchHigh = (task.context_cost ?? 0) > 0.3;
  const hasDueDate = task.due_date !== null;

  const getPriorityLabel = (priority: number | undefined | null): 'High' | 'Medium' | 'Low' => {
    if (priority !== undefined && priority !== null) {
      if (priority >= 67) return 'High';
      if (priority >= 34) return 'Medium';
    }
    return 'Low';
  };
  const priorityLabel = getPriorityLabel(task.priority);
  const priorityClasses = {
    High: 'bg-error-light-muted text-error-light dark:bg-error-dark-muted dark:text-error-dark',
    Medium: 'bg-warning-light-muted text-warning-light dark:bg-warning-dark-muted dark:text-warning-dark',
    Low: 'bg-success-light-muted text-success-light dark:bg-success-dark-muted dark:text-success-dark'
  };

  return (
    <>
      <div
        className={clsx(
          "relative cursor-pointer overflow-hidden rounded-lg border p-4 md:p-6 transition-all duration-200 hover:-translate-y-0.5",
          "bg-background-light dark:bg-background-dark",
          selected
            ? "border-secondary-light dark:border-secondary-dark ring-1 ring-secondary-light/50 dark:ring-secondary-dark/50"
            : "border-border-light dark:border-border-dark hover:border-gray-400 dark:hover:border-gray-600",
          { 'opacity-60': task.status === 'completed' || task.status === 'archived' }
        )}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            toggleTask(task.id);
          }
        }}
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <input
              type="checkbox"
              checked={selected}
              onChange={() => toggleTask(task.id)}
              className="mt-1 h-4 w-4 flex-shrink-0 cursor-pointer rounded border-gray-400 dark:border-gray-600 text-secondary-light dark:text-secondary-dark focus:ring-secondary-light dark:focus:ring-secondary-dark focus:ring-offset-0 focus:ring-1"
              onClick={(e) => e.stopPropagation()}
            />
            <h3 className={clsx(
               "truncate text-base font-medium text-foreground-light dark:text-foreground-dark",
               (task.status === 'completed' || task.status === 'archived') && "line-through"
             )}>
              {task.title}
            </h3>
            {task.flow_optimal && (
              <Zap size={14} className="mt-1 flex-shrink-0 text-yellow-500" />
            )}
          </div>
          {/* Metrics section */}
          <div className="ml-2 flex flex-shrink-0 items-center gap-2">
             <span className={clsx(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                priorityClasses[priorityLabel]
             )}>
               {priorityLabel}
             </span>
            {isContextSwitchHigh && (
              <div className="flex items-center gap-1 text-warning-light dark:text-warning-dark" title="High context switch cost">
                <AlertTriangle size={14} />
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="mb-4 text-sm leading-relaxed text-foreground-light-secondary dark:text-foreground-dark-secondary">
            {task.description}
          </p>
        )}

        {/* Progress Section */}
        <div className="mb-4 rounded-md bg-background-light-secondary p-3 dark:bg-background-dark">
          <div className="flex items-center gap-3">
            <div className="flex-1 cursor-pointer rounded p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5" onClick={() => setShowProgressModal(true)}>
              <ProgressBar
                progress={0 /* Placeholder */}
                size="medium"
                showPercentage
              />
            </div>
            <button
              className="flex items-center justify-center rounded p-1.5 text-gray-500 transition-all hover:bg-black/10 hover:text-secondary-light dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-secondary-dark"
              onClick={() => setShowProgressHistory(true)}
              title="View progress history"
            >
              <History size={16} />
            </button>
          </div>
          {task.completion_metrics?.lastNote && (
             // Removed problematic before/after classes
            <p className="relative mt-2 pl-4 text-xs italic leading-tight text-gray-600 dark:text-gray-400">
              "{task.completion_metrics.lastNote}"
            </p>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex flex-col items-start justify-between gap-2 border-t border-border-light pt-3 text-xs dark:border-border-dark sm:flex-row sm:items-center sm:gap-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
             <span className="capitalize text-foreground-light-secondary dark:text-foreground-dark-secondary">Status: <span className="font-medium text-foreground-light dark:text-foreground-dark">{task.status}</span></span>
            {hasDependencies && (
              <span className={clsx("rounded px-2 py-0.5 text-xs", dependenciesCompleted ? "bg-success-light-muted text-success-light dark:bg-success-dark-muted dark:text-success-dark" : "bg-warning-light-muted text-warning-light dark:bg-warning-dark-muted dark:text-warning-dark")}>
                {dependenciesCompleted ? '✓ Deps Met' : '⚠ Has Deps'}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-foreground-light-secondary dark:text-foreground-dark-secondary">
            {hasDueDate && (
              <span>Due: {new Date(task.due_date!).toLocaleDateString()}</span>
            )}
            <span>Est: {task.estimated_duration}m</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
           {task.status === 'active' && (
            <>
              <button
                className={clsx(
                  "flex-1 rounded px-3 py-1 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:flex-initial",
                  "bg-secondary-light text-white hover:bg-opacity-90 dark:bg-secondary-dark dark:hover:bg-opacity-90",
                  (hasDependencies && !dependenciesCompleted) && "bg-gray-400 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                )}
                onClick={handleStatusChange}
                disabled={isUpdating || (hasDependencies && !dependenciesCompleted)}
                title={hasDependencies && !dependenciesCompleted ? 'Complete dependencies first' : 'Mark as Complete'}
              >
                {isUpdating ? '...' : 'Complete'}
              </button>
              <button
                className="flex-1 rounded border border-border-light bg-transparent px-3 py-1 text-sm font-medium text-foreground-light transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-border-dark dark:text-foreground-dark dark:hover:bg-white/10 sm:flex-initial"
                onClick={() => setIsEditing(true)}
                disabled={isUpdating}
              >
                Edit
              </button>
               <button
                className="flex-1 rounded border border-transparent bg-transparent px-3 py-1 text-sm font-medium text-error-light transition-colors hover:bg-error-light-muted disabled:cursor-not-allowed disabled:opacity-50 dark:text-error-dark dark:hover:bg-error-dark-muted sm:flex-initial"
                onClick={() => handleDelete(task.id)}
                disabled={isUpdating}
              >
                Delete
              </button>
            </>
          )}
          {(task.status === 'completed' || task.status === 'archived') && (
             <button
                className={clsx(
                  "flex-1 rounded px-3 py-1 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:flex-initial",
                  "bg-gray-400 text-white hover:bg-opacity-90 dark:bg-gray-600 dark:hover:bg-opacity-90"
                )}
                onClick={handleStatusChange}
                disabled={isUpdating}
              >
                {isUpdating ? '...' : 'Reopen'}
              </button>
          )}

          <button
            className={clsx(
                "ml-auto flex-1 rounded border border-border-light bg-transparent px-3 py-1 text-sm font-medium text-foreground-light transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-border-dark dark:text-foreground-dark dark:hover:bg-white/10 sm:flex-initial",
                showDependencies && "bg-black/5 dark:bg-white/10"
            )}
            onClick={() => setShowDependencies(!showDependencies)}
            disabled={!hasDependencies}
            title={!hasDependencies ? "No dependencies" : "Show/Hide Dependencies"}
          >
            Deps {hasDependencies ? `(${dependencyCount})` : '(0)'}
          </button>
        </div>

        {showDependencies && projectTasks.length > 0 && (
          <div className="mt-4 border-t border-border-light pt-4 dark:border-border-dark">
             <TaskDependencyManager
              task={task}
              projectTasks={projectTasks}
              onUpdate={onUpdate || (() => {})}
            />
          </div>
        )}
      </div> {/* Closing main card div */}

      {/* Modals */}
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
