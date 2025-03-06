import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import styles from './styles.module.css';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false
}) => {
  return (
    <Dialog 
      open={open}
      onClose={onCancel}
      className={styles.dialog}
    >
      <DialogTitle className={styles.title}>
        {title}
      </DialogTitle>
      <DialogContent className={styles.content}>
        <p className={styles.message}>{message}</p>
      </DialogContent>
      <DialogActions className={styles.actions}>
        <Button
          onClick={onCancel}
          className={styles.cancelButton}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          className={`${styles.confirmButton} ${isDestructive ? styles.destructive : ''}`}
          autoFocus
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};