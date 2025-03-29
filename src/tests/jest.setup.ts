import "@testing-library/jest-dom";
import {
  jest,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from "@jest/globals";

// Mock browser APIs for tests
if (typeof window !== "undefined") {
  // Mock matchMedia
  const mockMatchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });

  window.matchMedia = window.matchMedia || mockMatchMedia;

  // Mock IntersectionObserver
  class MockIntersectionObserver {
    observe = () => {};
    unobserve = () => {};
    disconnect = () => {};
    root = null;
    rootMargin = "";
    thresholds = [];

    constructor() {
      // Constructor required for class instantiation
    }
  }

  window.IntersectionObserver =
    window.IntersectionObserver || MockIntersectionObserver;

  // Mock ResizeObserver
  class MockResizeObserver {
    observe = () => {};
    unobserve = () => {};
    disconnect = () => {};

    constructor() {
      // Constructor required for class instantiation
    }
  }

  window.ResizeObserver = window.ResizeObserver || MockResizeObserver;
}

// Configure global test environment
beforeAll(() => {
  // Add any global test setup here
  if (typeof window !== "undefined") {
    // Additional window setup if needed
    Object.defineProperty(window, "scrollTo", {
      value: () => {},
      writable: true,
    });
  }
});

afterAll(() => {
  // Add any global test cleanup here
});

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

afterEach(() => {
  // Clean up after each test
  jest.clearAllMocks();

  // Reset any document body modifications
  if (typeof document !== "undefined") {
    document.body.innerHTML = "";
  }
});

// Set longer timeout for tests
jest.setTimeout(10000); // 10 second timeout

// Silence console warnings during tests
// Only in test environment
if (process.env.NODE_ENV === "test") {
  // Fix the console error handler
  const originalError = console.error;
  console.error = (...args: any[]) => {
    // Check if first argument is a string before calling includes
    if (typeof args[0] === "string" && args[0].includes("Warning:")) return;
    originalError.call(console, ...args);
  };
}
