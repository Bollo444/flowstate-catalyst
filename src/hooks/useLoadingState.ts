import { useState, useCallback } from "react";
import type { AppError } from "../types/error";

export interface LoadingState {
  isLoading: boolean;
  error: AppError | null;
  setLoading: (state: boolean) => void;
  setError: (error: AppError | null) => void;
  clearError: () => void;
  startLoading: () => void;
  stopLoading: () => void;
  wrapAsync: <T>(asyncFn: () => Promise<T>) => Promise<T>;
}

/**
 * Hook to manage loading states and errors in components
 */
export function useLoadingState(): LoadingState {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const wrapAsync = useCallback(
    async <T>(asyncFn: () => Promise<T>): Promise<T> => {
      try {
        startLoading();
        const result = await asyncFn();
        return result;
      } catch (err) {
        setError(err as AppError);
        throw err;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  return {
    isLoading,
    error,
    setLoading: setIsLoading,
    setError,
    clearError,
    startLoading,
    stopLoading,
    wrapAsync,
  };
}
