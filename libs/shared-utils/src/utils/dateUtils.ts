import { CalendarDate, getLocalTimeZone, Time } from '@internationalized/date';
import { addDays, differenceInYears, format, formatDistance, startOfWeek } from 'date-fns';

/**
 * Validates whether the given value represents a valid date.
 *
 * This function checks if the input is a valid date string in the `YYYY-MM-DD` format
 * or a valid timestamp. It ensures that the provided date values are correctly
 * interpreted by JavaScript’s `Date` object (e.g., rejecting invalid dates like `2025-02-33`).
 *
 * @param {string | number} value - The input value to validate. It can be a date string in
 *        `YYYY-MM-DD` format or a timestamp.
 * @returns {boolean} Returns `true` if the value represents a valid date, otherwise `false`.
 *
 * @example
 * isValidDate("2025-02-28"); // true
 * isValidDate("2025-02-33"); // false
 * isValidDate(1672531199000); // true (valid timestamp)
 * isValidDate("invalid-date"); // false
 * isValidDate(""); // false
 */
const isValidDate = (value: string | number): boolean => {
  if (!value) {
    return false;
  }
  if (typeof value !== 'string' && typeof value !== 'number') {
    return false;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    const constructedDate = new Date(year, month - 1, day);
    return (
      constructedDate.getFullYear() === year &&
      constructedDate.getMonth() + 1 === month &&
      constructedDate.getDate() === day
    );
  }
  const date = new Date(value);
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Converts a JavaScript `Date` object into a `CalendarDate` object.
 *
 * This function extracts the year, month, and day from the given `Date`
 * object and constructs a new `CalendarDate` instance.
 *
 * @param {Date} date - The JavaScript `Date` object to be converted.
 * @returns {CalendarDate} A `CalendarDate` instance representing the same date.
 *
 * @example
 * const date = new Date(2025, 0, 15); // January 15, 2025
 * const calendarDate = dateToCalendarDate(date);
 * console.log(calendarDate); // CalendarDate { year: 2025, month: 1, day: 15 }
 */
const dateToCalendarDate = (date: Date): CalendarDate => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return new CalendarDate(year, month, day);
};

/**
 * Converts a JavaScript `Date` object into a `Time` instance.
 *
 * This function extracts the hour, minute, second, and millisecond from the given `Date` object
 * and constructs a new `Time` instance, representing only the time portion of the date.
 *
 * @param {Date} date - The JavaScript `Date` object from which to extract the time.
 * @returns {Time} A `Time` instance containing the extracted hour, minute, second, and millisecond.
 *
 * @example
 * const date = new Date(2025, 0, 15, 14, 30, 45, 500); // 2025-01-15 14:30:45.500
 * const calendarTime = dateToCalendarTime(date);
 * console.log(calendarTime); // Time { hour: 14, minute: 30, second: 45, millisecond: 500 }
 */
const dateToCalendarTime = (date: Date): Time => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const millisecond = date.getMilliseconds();
  return new Time(hour, minute, second, millisecond);
};

function calendarDateToUnixTime(date: CalendarDate): number {
  return date.toDate(getLocalTimeZone()).getTime();
}

function numberToMonthName(month: number): string {
  return format(new Date(0, month - 1), 'MMMM');
}

// get age based on date of birth
function calculateAge(dob: Date) {
  return differenceInYears(new Date(), dob);
}

// format the time format
function formatShortDateTime(date: Date) {
  return format(date, 'dd MMM yy h:mm a');
}

// get how long it passed until now based on the given date
function timeAgo(date: string) {
  return formatDistance(new Date(date), new Date()) + ' ago';
}

/**
 * 获取给定日期所在一周（从周日开始）的所有日期。
 *
 * @param date - 任意目标日期
 * @returns 包含从周日到周六的 7 个 Date 对象数组
 *
 * 示例：
 * 输入：2025-04-04（周五）
 * 返回：[2025-03-30 (周日), 2025-03-31 (周一), ..., 2025-04-05 (周六)]
 */
function getWeekDates(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 0 }); // 0 = 周日
  const week = Array.from({ length: 7 }).map((_, index) => addDays(start, index));
  return week;
}

/**
 * 计算事件在日历中的垂直偏移量（top offset）
 *
 * 用于将某个开始时间的事件正确定位到日历中对应的位置（例如用于生成 CSS `top` 值）。
 *
 * @param startTime - 事件的开始时间（Date 类型）
 * @param calendarStartHour - 日历开始的小时数（例如 8 表示从早上 8 点开始）, 或者是上一级事件开始的时间
 * @param rowHeight - 每一行（时间区块）的高度（单位：像素）
 * @param intervalPerHour - 每小时被划分为多少段（例如 4 表示每 15 分钟一段）
 * @returns 返回事件距离顶部的偏移量（单位：像素）
 *
 * 示例：
 * 如果一个事件是 09:30 开始，日历从 08:00 开始，每小时分成 4 段（即 15 分钟一行），每行高度 20px，
 * 那么它应该被定位在 ((90 / 15) * 20) = 120px 的位置。
 */
const getTopOffset = (
  startTime: Date,
  calendarStartHour: number,
  rowHeight: number,
  intervalPerHour: number
) => {
  const hour = startTime.getHours();
  const minutes = startTime.getMinutes();
  const totalMinutesFromStart = (hour - calendarStartHour) * 60 + minutes;
  const minutePerRow = 60 / intervalPerHour;
  return (totalMinutesFromStart / minutePerRow) * rowHeight;
};

/**
 * 计算事件在日历中的高度（单位：像素）
 *
 * 用于根据事件的开始和结束时间，计算其在垂直日历视图中的显示高度，
 * 通常用于生成 CSS 样式中的 `height` 值。
 *
 * @param startTime - 事件的开始时间（Date 类型）
 * @param endTime - 事件的结束时间（Date 类型）
 * @param rowHeight - 每一个时间区块（例如 15 分钟）的高度（单位：像素）
 * @param intervalPerHour - 每小时被划分为的时间段数量（例如 4 表示每小时4段，每段15分钟）
 * @returns 返回事件在日历中应该占用的高度（单位：像素）
 *
 * 示例：
 * 如果事件从 10:00 到 10:45，rowHeight = 20px，intervalPerHour = 4（即每段15分钟），
 * 那么 duration 是 45 分钟，占用 3 段，每段 20px，最终高度为 60px。
 */
const getEventHeight = (
  startTime: Date,
  endTime: Date,
  rowHeight: number,
  intervalPerHour: number
) => {
  const durationInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
  const minutePerRow = 60 / intervalPerHour;
  return (durationInMinutes / minutePerRow) * rowHeight;
};

// 不常用
/**
 * Generates an array of dates with 30-minute intervals between the given start time and end time.
 *
 * @param {Date} startTime - The start time of the time range.
 * @param {Date} endTime - The end time of the time range.
 * @returns {Date[]} An array of dates with 30-minute intervals between the start time and end time.
 *
 * @example
 * const startTime = new Date(2025, 0, 15, 8, 0, 0, 0); // 2025-01-15 08:00:00
 * const endTime = new Date(2025, 0, 15, 18, 0, 0, 0); // 2025-01-15 18:00:00
 * const timeArray = generateTimeArray(startTime, endTime);
 * console.log(timeArray);
 * // [
 * //   2025-01-15T08:00:00.000Z,
 * //   2025-01-15T08:30:00.000Z,
 * //   2025-01-15T09:00:00.000Z,
 * //   ...,
 * //   2025-01-15T17:30:00.000Z,
 * // ]
 */
function generateTimeArray(startTime: Date, endTime: Date): Date[] {
  const timeArray: Date[] = [];
  const currentTime = new Date(startTime);

  while (currentTime <= endTime) {
    timeArray.push(new Date(currentTime));
    currentTime.setMinutes(currentTime.getMinutes() + 30);
  }

  return timeArray;
}

function normalizeDate(date: unknown): string | null {
  if (!date) return null;
  if (typeof date === 'string') return date;
  if (date instanceof Date) return date.toISOString();
  return null;
}

export {
  isValidDate,
  dateToCalendarDate,
  dateToCalendarTime,
  calendarDateToUnixTime,
  numberToMonthName,
  calculateAge,
  formatShortDateTime,
  timeAgo,
  generateTimeArray,
  getTopOffset,
  getEventHeight,
  getWeekDates,
  normalizeDate,
};
