import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import clsx from 'clsx'; // Import clsx

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
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      // Apply Tailwind classes using PaperProps slot for background, text, rounded corners
      PaperProps={{
        className: "bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark rounded-lg min-w-[320px]"
      }}
    >
      <DialogTitle className="px-6 pt-6 pb-4 text-lg font-semibold"> {/* Adjusted padding */}
        {title}
      </DialogTitle>
      <DialogContent className="px-6 pb-6"> {/* Adjusted padding */}
        <p className="m-0 text-base leading-normal text-foreground-light-secondary dark:text-foreground-dark-secondary">{message}</p>
      </DialogContent>
      {/* Apply Tailwind classes to actions container and buttons */}
      <DialogActions className="border-t border-border-light dark:border-border-dark px-6 py-4">
        <Button
           onClick={onCancel}
           // Using Tailwind classes directly on MUI Button
           className="border border-border-light dark:border-border-dark text-foreground-light dark:text-foreground-dark hover:bg-black/5 dark:hover:bg-white/10 normal-case px-4 py-2 rounded"
         >
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          className={clsx(
             "text-white normal-case px-4 py-2 rounded ml-4", // Base styles
             isDestructive
               ? "bg-error-light dark:bg-error-dark hover:bg-error-light/90 dark:hover:bg-error-dark/90" // Destructive theme colors + adjusted hover
               : "bg-secondary-light dark:bg-secondary-dark hover:bg-secondary-light/90 dark:hover:bg-secondary-dark/90" // Default theme colors + adjusted hover
          )}
          autoFocus
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
