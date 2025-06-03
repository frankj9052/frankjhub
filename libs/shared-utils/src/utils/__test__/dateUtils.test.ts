import { CalendarDate, Time } from '@internationalized/date';
import { isValidDate, dateToCalendarDate, dateToCalendarTime } from '../dateUtils';

describe('isValidDate', () => {
  // 测试有效的日期字符串
  test('returns true for valid date strings', () => {
    expect(isValidDate('2023-10-05')).toBe(true);
    expect(isValidDate('2023-10-05T14:30:00.000Z')).toBe(true);
    expect(isValidDate('October 5, 2023')).toBe(true);
  });

  // 测试无效的日期字符串
  test('returns false for invalid date strings', () => {
    expect(isValidDate('invalid-date')).toBe(false);
    expect(isValidDate('2023-02-30')).toBe(false); // 无效的日期
    expect(isValidDate('')).toBe(false); // 空字符串
  });

  // 测试有效的时间戳
  test('returns true for valid timestamps', () => {
    expect(isValidDate(1696521600000)).toBe(true); // 2023-10-05 的时间戳
  });

  // 测试无效的时间戳
  test('returns false for invalid timestamps', () => {
    expect(isValidDate(NaN)).toBe(false);
    expect(isValidDate(Infinity)).toBe(false);
  });

  // 测试边界情况
  test('returns false for non-date values', () => {
    expect(isValidDate(null as unknown as string)).toBe(false);
    expect(isValidDate(undefined as unknown as string)).toBe(false);
    expect(isValidDate({} as unknown as string)).toBe(false);
  });
});

describe('dateToCalendarDate', () => {
  test('should convert a normal date correctly', () => {
    const date = new Date(2025, 0, 15); // 2025-01-15 (Month is 0-based in JS)
    const result = dateToCalendarDate(date);
    expect(result).toEqual(new CalendarDate(2025, 1, 15));
  });

  test('should convert first day of the year correctly', () => {
    const date = new Date(2024, 0, 1); // 2024-01-01
    const result = dateToCalendarDate(date);
    expect(result).toEqual(new CalendarDate(2024, 1, 1));
  });

  test('should convert last day of the year correctly', () => {
    const date = new Date(2023, 11, 31); // 2023-12-31
    const result = dateToCalendarDate(date);
    expect(result).toEqual(new CalendarDate(2023, 12, 31));
  });

  test('should handle leap year correctly', () => {
    const date = new Date(2024, 1, 29); // 2024-02-29 (leap year)
    const result = dateToCalendarDate(date);
    expect(result).toEqual(new CalendarDate(2024, 2, 29));
  });

  test('should convert December 31 correctly', () => {
    const date = new Date(2025, 11, 31); // 2025-12-31
    const result = dateToCalendarDate(date);
    expect(result).toEqual(new CalendarDate(2025, 12, 31));
  });
});

describe('dateToCalendarTime', () => {
  test('should convert a standard time correctly', () => {
    const date = new Date(2025, 0, 15, 14, 30, 45, 500); // 14:30:45.500
    const result = dateToCalendarTime(date);
    expect(result).toEqual(new Time(14, 30, 45, 500));
  });

  test('should convert midnight (00:00:00.000) correctly', () => {
    const date = new Date(2025, 0, 15, 0, 0, 0, 0);
    const result = dateToCalendarTime(date);
    expect(result).toEqual(new Time(0, 0, 0, 0));
  });

  test('should convert end of day (23:59:59.999) correctly', () => {
    const date = new Date(2025, 0, 15, 23, 59, 59, 999);
    const result = dateToCalendarTime(date);
    expect(result).toEqual(new Time(23, 59, 59, 999));
  });

  test('should convert a random morning time correctly', () => {
    const date = new Date(2025, 0, 15, 9, 15, 20, 250);
    const result = dateToCalendarTime(date);
    expect(result).toEqual(new Time(9, 15, 20, 250));
  });

  test('should convert a random afternoon time correctly', () => {
    const date = new Date(2025, 0, 15, 18, 45, 10, 700);
    const result = dateToCalendarTime(date);
    expect(result).toEqual(new Time(18, 45, 10, 700));
  });
});
