import React, { useState } from 'react';
import { useTasks } from '../../../hooks/useTasks';
import { useTaskSelection } from '../../../context/TaskSelectionContext';
import { Task } from '../../../types/database';
import { ConfirmDialog } from '../../shared/ConfirmDialog';
import { UserSelector } from '../../shared/UserSelector';
import styles from './styles.module.css';

interface BatchActionsBarProps {
  tasks: Task[];
}

export const BatchActionsBar: React.FC<BatchActionsBarProps> = ({ tasks }) => {
  const { selectedTasks, clearSelection, selectedCount } = useTaskSelection();
  const { updateTaskStatus, deleteTask, updateTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [assignError, setAssignError] = useState<string | undefined>(undefined);

  const handleStatusUpdate = async (status: Task['status']) => {
    setIsUpdating(true);
    try {
      await Promise.all(
        Array.from(selectedTasks).map(taskId => 
          updateTaskStatus(taskId, status)
        )
      );
      clearSelection();
    } catch (error) {
      console.error('Failed to update tasks:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssignment = async (userIds: string[]) => {
    setIsUpdating(true);
    setAssignError(undefined);
    try {
      await Promise.all(
        Array.from(selectedTasks).map(taskId =>
          updateTask(taskId, {
            assignee_id: userIds.length === 1 ? userIds[0] : null,
            // If multiple users are selected, we'll need to handle this differently
            // Perhaps create multiple assignments in a different table
          })
        )
      );
      clearSelection();
    } catch (error) {
      console.error('Failed to assign tasks:', error);
      setAssignError('Failed to assign tasks. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await Promise.all(
        Array.from(selectedTasks).map(taskId => 
          deleteTask(taskId)
        )
      );
      clearSelection();
    } catch (error) {
      console.error('Failed to delete tasks:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!selectedCount) return null;

  return (
    <>
      <div className={styles.batchActionsBar}>
        <div className={styles.info}>
          <span className={styles.count}>{selectedCount} selected</span>
          <button
            onClick={clearSelection}
            className={styles.clearButton}
          >
            Clear
          </button>
        </div>

        <div className={styles.actions}>
          <div className={styles.assignSection}>
            <UserSelector
              multiple
              selectedUserIds={[]}
              onMultiChange={handleAssignment}
              label="Assign to"
              disabled={isUpdating}
              error={assignError}
            />
          </div>

          <div className={styles.statusActions}>
            <button
              onClick={() => handleStatusUpdate('pending')}
              className={styles.actionButton}
              disabled={isUpdating}
            >
              Mark as To Do
            </button>
            <button
              onClick={() => handleStatusUpdate('in_progress')}
              className={styles.actionButton}
              disabled={isUpdating}
            >
              Mark In Progress
            </button>
            <button
              onClick={() => handleStatusUpdate('completed')}
              className={styles.actionButton}
              disabled={isUpdating}
            >
              Mark Complete
            </button>
          </div>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className={`${styles.actionButton} ${styles.deleteButton}`}
            disabled={isDeleting}
          >
            Delete Selected
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Tasks"
        message={`Are you sure you want to delete ${selectedCount} selected ${selectedCount === 1 ? 'task' : 'tasks'}? This action cannot be undone.`}
        confirmLabel="Delete Tasks"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isDestructive
      />
    </>
  );
};