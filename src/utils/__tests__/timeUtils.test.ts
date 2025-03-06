import { formatDuration } from '../timeUtils';

describe('timeUtils', () => {
  describe('formatDuration', () => {
    test('should format minutes only', () => {
      expect(formatDuration(45)).toBe('45m');
    });

    test('should format hours and minutes', () => {
      expect(formatDuration(90)).toBe('1h 30m');
    });

    test('should handle zero', () => {
      expect(formatDuration(0)).toBe('0m');
    });
  });
});