import '@testing-library/jest-dom';
import { jest, beforeAll, afterAll } from '@jest/globals';
import { configure } from '@testing-library/dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(className: string): R;
      toHaveStyle(style: Record<string, any>): R;
      toBeVisible(): R;
      toHaveTextContent(text: string | RegExp): R;
    }
  }
}

// Mock IntersectionObserver if needed
if (typeof window !== 'undefined') {
  const mockObserveImplementation = function() {
    return {
      observe: function() {
        return null;
      },
      unobserve: function() {
        return null;
      },
      disconnect: function() {
        return null;
      }
    };
  };

  // @ts-ignore
  window.IntersectionObserver = window.IntersectionObserver ||
    function() {
      return mockObserveImplementation();
    };

  // @ts-ignore
  window.ResizeObserver = window.ResizeObserver ||
    function() {
      return mockObserveImplementation();
    };
}

// Configure testing library
configure({
  testIdAttribute: 'data-testid'
});

// Global test setup
beforeAll(() => {
  // Add any global test setup here
});

// Global test teardown
afterAll(() => {
  // Add any global test cleanup here
});