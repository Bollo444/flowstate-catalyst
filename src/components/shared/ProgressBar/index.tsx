import React from "react";
import styles from "./styles.module.css";

interface ProgressBarProps {
  progress: number;
  size?: "small" | "medium" | "large";
  showPercentage?: boolean;
  interactive?: boolean;
  onChange?: (progress: number) => void;
  color?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = "medium",
  showPercentage = true,
  interactive = false,
  onChange,
  color = "#4A9EFF",
  className,
}) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  const handleBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !onChange) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    onChange(Math.round(percentage));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!interactive || !onChange) return;

    const step = event.shiftKey ? 10 : 1;

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        onChange(Math.max(0, clampedProgress - step));
        break;
      case "ArrowRight":
        event.preventDefault();
        onChange(Math.min(100, clampedProgress + step));
        break;
      case "Home":
        event.preventDefault();
        onChange(0);
        break;
      case "End":
        event.preventDefault();
        onChange(100);
        break;
    }
  };

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <div
        className={`${styles.progressBar} ${styles[size]} ${interactive ? styles.interactive : ""}`}
        onClick={handleBarClick}
        onKeyDown={handleKeyDown}
        role={interactive ? "slider" : "progressbar"}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clampedProgress}
        tabIndex={interactive ? 0 : undefined}
        style={
          {
            "--progress-color": color,
          } as React.CSSProperties
        }
      >
        <div
          className={styles.progress}
          style={{ width: `${clampedProgress}%` }}
        />
        {interactive && (
          <div
            className={styles.handle}
            style={{ left: `${clampedProgress}%` }}
          />
        )}
      </div>
      {showPercentage && (
        <span className={styles.percentage}>{clampedProgress}%</span>
      )}
    </div>
  );
};
