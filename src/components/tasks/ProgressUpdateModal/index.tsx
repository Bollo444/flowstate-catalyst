import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Task } from '../../../types/database';
import { ProgressBar } from '../../shared/ProgressBar';
import styles from './styles.module.css';

interface ProgressUpdateModalProps {
  open: boolean;
  onClose: () => void;
  task: Task;
  onUpdate: (progress: number, note: string) => Promise<void>;
}

export const ProgressUpdateModal: React.FC<ProgressUpdateModalProps> = ({
  open,
  onClose,
  task,
  onUpdate
}) => {
  const [progress, setProgress] = useState(task.progress || 0);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onUpdate(progress, note);
      onClose();
    } catch (error) {
      console.error('Failed to update progress:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      className={styles.dialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle className={styles.title}>
        Update Progress
      </DialogTitle>

      <DialogContent className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.progressSection}>
            <label>Progress</label>
            <div className={styles.progressControl}>
              <ProgressBar
                progress={progress}
                onChange={setProgress}
                interactive
                size="large"
                showPercentage
              />
            </div>
          </div>

          <div className={styles.noteSection}>
            <label htmlFor="progressNote">Progress Note</label>
            <textarea
              id="progressNote"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add details about the progress update..."
              rows={4}
              className={styles.noteInput}
            />
            <p className={styles.noteHint}>
              Optional: Add context about what was completed or any blockers encountered
            </p>
          </div>

          <div className={styles.presets}>
            <label>Quick Update</label>
            <div className={styles.presetButtons}>
              <button
                type="button"
                onClick={() => setProgress(25)}
                className={progress === 25 ? styles.active : ''}
              >
                Started (25%)
              </button>
              <button
                type="button"
                onClick={() => setProgress(50)}
                className={progress === 50 ? styles.active : ''}
              >
                Halfway (50%)
              </button>
              <button
                type="button"
                onClick={() => setProgress(75)}
                className={progress === 75 ? styles.active : ''}
              >
                Almost Done (75%)
              </button>
              <button
                type="button"
                onClick={() => setProgress(100)}
                className={progress === 100 ? styles.active : ''}
              >
                Complete (100%)
              </button>
            </div>
          </div>
        </form>
      </DialogContent>

      <DialogActions className={styles.actions}>
        <button
          onClick={onClose}
          className={styles.cancelButton}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update Progress'}
        </button>
      </DialogActions>
    </Dialog>
  );
};