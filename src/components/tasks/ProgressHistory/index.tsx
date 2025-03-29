import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { ProgressUpdate, AppError } from "../../../types/database";
import { useProgressHistory } from "../../../hooks/useProgressHistory";
import { LoadingSpinner } from "../../shared/LoadingSpinner";
import { ErrorDisplay } from "../../shared/ErrorDisplay";
import { ProgressBar } from "../../shared/ProgressBar";
import { formatDistanceToNow } from "date-fns";
import styles from "./styles.module.css";

interface ProgressHistoryProps {
  taskId: string;
  open: boolean;
  onClose: () => void;
}

export const ProgressHistory: React.FC<ProgressHistoryProps> = ({
  taskId,
  open,
  onClose,
}) => {
  const { history, loading, error, deleteProgressUpdate } =
    useProgressHistory(taskId);

  const handleDelete = async (updateId: string) => {
    if (!confirm("Are you sure you want to delete this progress update?")) {
      return;
    }

    try {
      await deleteProgressUpdate(updateId);
    } catch (error) {
      console.error("Failed to delete progress update:", error);
    }
  };

  const renderTimelineItem = (update: ProgressUpdate) => {
    return (
      <div key={update.id} className={styles.timelineItem}>
        <div className={styles.timelineIcon}>
          {update.user?.avatar_url ? (
            <img
              src={update.user.avatar_url}
              alt={update.user.full_name || update.user.email}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {(update.user?.full_name || update.user?.email || "?")
                .charAt(0)
                .toUpperCase()}
            </div>
          )}
        </div>

        <div className={styles.timelineContent}>
          <div className={styles.header}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {update.user?.full_name || update.user?.email || "Unknown User"}
              </span>
              <span className={styles.timestamp}>
                {formatDistanceToNow(new Date(update.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <button
              className={styles.deleteButton}
              onClick={() => handleDelete(update.id)}
              title="Delete update"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className={styles.progressUpdate}>
            <ProgressBar
              progress={update.progress}
              size="small"
              showPercentage
            />
          </div>

          {update.note && <p className={styles.note}>{update.note}</p>}
        </div>
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className={styles.dialog}
    >
      <DialogTitle className={styles.title}>Progress History</DialogTitle>

      <DialogContent className={styles.content}>
        {loading ? (
          <div className={styles.loading}>
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className={styles.error}>
            <ErrorDisplay
              error={{
                code: "PROGRESS_HISTORY_ERROR",
                message: "Failed to load progress history",
                details: error,
              }}
            />
          </div>
        ) : history.length === 0 ? (
          <div className={styles.empty}>
            <p>No progress updates yet</p>
          </div>
        ) : (
          <div className={styles.timeline}>
            {history.map(renderTimelineItem)}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
