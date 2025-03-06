import React from 'react';
import styles from './styles.module.css';
import { AppError } from '../../../types/error';

interface ErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss
}) => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3>{error.code}</h3>
        <p>{error.message}</p>
        {error.details && (
          <pre className={styles.errorDetails}>
            {JSON.stringify(error.details, null, 2)}
          </pre>
        )}
        <div className={styles.errorActions}>
          {onRetry && (
            <button onClick={onRetry} className={styles.retryButton}>
              Try Again
            </button>
          )}
          {onDismiss && (
            <button onClick={onDismiss} className={styles.dismissButton}>
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
};