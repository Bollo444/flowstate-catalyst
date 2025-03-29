/**
 * Creates a debounced version of a function that delays its execution
 * until after `delay` milliseconds have elapsed since the last time it was called.
 *
 * @param func The function to debounce
 * @param delay The delay in milliseconds
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Creates a debounced version of a function that returns a Promise
 * and delays its execution until after `delay` milliseconds have elapsed.
 *
 * @param func The async function to debounce
 * @param delay The delay in milliseconds
 * @returns A debounced version of the async function
 */
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  delay: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: NodeJS.Timeout;

  return function (...args: Parameters<T>): Promise<ReturnType<T>> {
    clearTimeout(timeoutId);

    return new Promise((resolve) => {
      timeoutId = setTimeout(async () => {
        const result = await func(...args);
        resolve(result);
      }, delay);
    });
  };
}
