import React from "react";
import { AppError } from "../../../types/error";
import { AlertTriangle } from 'lucide-react'; // Use a proper icon component

interface ErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
}) => {
  // Don't render if no error object is provided
  if (!error) return null;

  return (
    // Overlay Container: Fixed position, full screen, centered items, background overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      {/* Content Box: Themed background, rounded, padding, shadow, text center, max width */}
      <div className="w-full max-w-md rounded-lg bg-background-light p-6 text-center shadow-xl dark:bg-background-dark">
        {/* Icon */}
        <div className="mb-4 text-5xl text-warning-light dark:text-warning-dark mx-auto w-fit"> {/* Increased size */}
           <AlertTriangle size={48} strokeWidth={1.5}/> {/* Adjusted stroke */}
        </div>
        {/* Title: Use error color */}
        <h3 className="mb-2 text-xl font-semibold text-error-light dark:text-error-dark">{error.code || 'An Error Occurred'}</h3>
        {/* Message */}
        <p className="mb-6 text-foreground-light-secondary dark:text-foreground-dark-secondary">{error.message}</p>
        {error.details && (
          // Details Preformatted Text: Themed background, rounded, padding, scrollable, text left
          <pre className="mb-6 max-h-40 overflow-y-auto whitespace-pre-wrap rounded bg-background-light-secondary p-3 text-left text-xs text-foreground-light-secondary dark:bg-background-dark-secondary dark:text-foreground-dark-secondary">
            {JSON.stringify(error.details, null, 2)}
          </pre>
        )}
        {/* Action Buttons: Centered, gap */}
        <div className="flex justify-center gap-4">
          {onRetry && (
            <button
              onClick={onRetry}
              // Themed Retry Button (e.g., using success colors)
              className="rounded px-6 py-2 font-semibold text-white bg-success-light transition-colors hover:bg-success-light/90 focus:outline-none focus:ring-2 focus:ring-success-light focus:ring-offset-2 dark:bg-success-dark dark:hover:bg-success-dark/90 dark:focus:ring-offset-background-dark"
            >
              Try Again
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              // Themed Dismiss Button (e.g., using subtle colors)
              className="rounded px-6 py-2 font-semibold border border-border-light bg-transparent text-foreground-light transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:border-border-dark dark:text-foreground-dark dark:hover:bg-gray-700 dark:focus:ring-offset-background-dark"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
