/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import type { expect } from "@jest/globals";

declare global {
  namespace jest {
    interface Matchers<R>
      extends TestingLibraryMatchers<typeof expect.stringContaining, R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(className: string | string[]): R;
      toHaveStyle(css: Record<string, any>): R;
      toBeVisible(): R;
      toBeEmpty(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveFocus(): R;
      toBeChecked(): R;
      toBePartiallyChecked(): R;
      toBeRequired(): R;
      toBeInvalid(): R;
      toBeValid(): R;
      toHaveValue(value?: string | string[] | number): R;
      toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R;
      toBeEmptyDOMElement(): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(html: string): R;
      toHaveDescription(text: string | RegExp): R;
    }
  }
}

declare module "@testing-library/jest-dom" {
  export interface JestMatchers<R = void, T = {}>
    extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
}

// Explicitly define test function types
declare const beforeAll: typeof jest.beforeAll;
declare const afterAll: typeof jest.afterAll;
declare const beforeEach: typeof jest.beforeEach;
declare const afterEach: typeof jest.afterEach;
declare const describe: typeof jest.describe;
declare const it: typeof jest.it;
declare const test: typeof jest.test;
declare const expect: typeof jest.expect;
declare const jest: typeof import("@jest/globals").jest;
