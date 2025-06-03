import { truncateString } from '../textUtils';
describe('truncateString', () => {
  test('should return the full string if it is shorter than the limit', () => {
    expect(truncateString('Hello', 10)).toBe('Hello');
  });

  test('should return the truncated string with "..." if it exceeds the limit', () => {
    expect(truncateString('Hello, this is a test string!', 10)).toBe('Hello, thi...');
  });

  test('should handle an empty string correctly', () => {
    expect(truncateString('', 10)).toBe('');
  });

  test('should return null if input is null', () => {
    expect(truncateString(null, 10)).toBeNull();
  });

  test('should return null if input is undefined', () => {
    expect(truncateString(undefined, 10)).toBeNull();
  });

  test('should return the original string if its length is exactly the limit', () => {
    expect(truncateString('1234567890', 10)).toBe('1234567890');
  });

  test('should truncate correctly when default limit (50) is used', () => {
    const longText = 'A'.repeat(55); // 55 个字符
    expect(truncateString(longText)).toBe('A'.repeat(50) + '...');
  });

  test('should return an empty string if input is an empty string and limit is 0', () => {
    expect(truncateString('', 0)).toBe('');
  });

  test('should return "..." if a non-empty string is truncated to 0', () => {
    expect(truncateString('Hello', 0)).toBe('...');
  });
});
