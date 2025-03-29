import React from "react";
import { CircularProgress } from "@mui/material";
import clsx from 'clsx';

export interface SpinnerProps {
  size?: "small" | "medium" | "large";
  // Use MUI's CircularProgress color prop values
  color?: "primary" | "secondary" | "inherit" | "error" | "info" | "success" | "warning";
  message?: string;
  className?: string;
  variant?: "default" | "inline" | "container" | "fullPage"; // Layout variants
}

const spinnerSizes = {
  small: 24,
  medium: 40,
  large: 56,
};

const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
};

const paddingAndGap = {
    small: 'p-2 gap-2',
    medium: 'p-4 gap-4',
    large: 'p-6 gap-6'
};

export const LoadingSpinner: React.FC<SpinnerProps> = ({
  size = "medium",
  color = "secondary", // Default to secondary color
  message,
  className,
  variant = "default", // Default layout variant
}) => {
  const currentSize = spinnerSizes[size];
  const currentTextSize = textSizes[size];
  const currentPaddingGap = paddingAndGap[size];

  const containerClasses = clsx(
    'flex flex-col items-center justify-center',
    // Apply padding and gap based on size unless inline
    variant !== 'inline' && currentPaddingGap,
    {
      'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm': variant === 'fullPage',
      'w-full h-full min-h-[100px]': variant === 'container', // Reduced min-height
      'inline-flex !p-0 !gap-2': variant === 'inline', // Inline layout overrides padding/gap
    },
    className
  );

  return (
    <div className={containerClasses}>
      <CircularProgress size={currentSize} color={color} />
      {message && (
        <p className={clsx(
            "text-foreground-light-secondary dark:text-foreground-dark-secondary text-center",
             currentTextSize,
             variant === 'inline' ? 'm-0' : 'mt-2' // No top margin for inline message
          )}>
           {message}
        </p>
      )}
    </div>
  );
};
