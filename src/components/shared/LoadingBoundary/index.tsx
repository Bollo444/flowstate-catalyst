"use client";

import React from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import styles from "./styles.module.css";

export interface LoadingBoundaryProps {
  children: React.ReactNode;
  loadingMessage?: string;
  testId?: string;
  isLoading?: boolean;
  spinnerSize?: "small" | "medium" | "large";
  className?: string;
}

export function LoadingBoundary({
  children,
  loadingMessage = "Loading...",
  testId,
  isLoading = false,
  spinnerSize = "medium",
  className = "",
}: LoadingBoundaryProps) {
  if (isLoading) {
    return (
      <div
        className={`${styles.loadingContainer} ${className}`}
        data-testid={`${testId}-loading`}
      >
        <LoadingSpinner size={spinnerSize} />
        {loadingMessage && <p className={styles.message}>{loadingMessage}</p>}
      </div>
    );
  }

  return (
    <div className={className} data-testid={testId}>
      {children}
    </div>
  );
}
