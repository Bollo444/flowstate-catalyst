import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
  <div className="p-6 bg-red-50 rounded-lg border border-red-200">
    <div className="flex items-center gap-3 mb-4">
      <AlertTriangle className="text-red-500 w-6 h-6" />
      <h3 className="text-lg font-semibold text-red-700">Flow Interrupted</h3>
    </div>
    
    <p className="text-red-600 mb-4">
      {error.message || 'An unexpected error occurred'}
    </p>
    
    <button
      onClick={resetErrorBoundary}
      className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
    >
      <RefreshCcw className="w-4 h-4" />
      Retry
    </button>
  </div>
);

export const FlowErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    {children}
  </ErrorBoundary>
);