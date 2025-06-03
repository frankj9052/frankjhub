import { useEffect } from 'react';
import {
  CalendarDate,
  DateValue,
  endOfMonth,
  getDayOfWeek,
  getLocalTimeZone,
  startOfMonth,
  today,
} from '@internationalized/date';
import clsx from 'clsx';
import { Card, Spacer } from '@heroui/react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { dateToCalendarDate, numberToMonthName } from '@frankjhub/shared-utils';
import { useControlledState } from '../../../useHooks';
import { FrankButtonBase } from '../../general';

const currentDay = today(getLocalTimeZone());
type Props = {
  variant?: 'Small' | 'Default' | 'WithShortcut';
  isStartDateSelection?: boolean;
  value?: DateValue | null;
  onValueChange?: (value: DateValue | null | undefined) => void;
  focusedValue?: CalendarDate;
  onFocusedValueChange?: (date: CalendarDate | null | undefined) => void;
  minValue?: DateValue | null;
  maxValue?: DateValue | null;
  rangeStart?: DateValue | null;
  rangeEnd?: DateValue | null;
};

/**
 * A customizable calendar component that supports date selection,
 * optional range highlighting, and quick shortcut buttons for faster selection.
 *
 * @param {'Small' | 'Default' | 'WithShortcut'} [variant='Default'] - Optional. Visual variant of the calendar.
 * @param {boolean} [isStartDateSelection] - Optional. Whether the calendar is for selecting a start date (affects shortcut options).
 * @param {DateValue | null} [value] - Optional. Currently selected date value.
 * @param {(value: DateValue | null | undefined) => void} [onValueChange] - Optional. Callback triggered when a date is selected.
 * @param {CalendarDate} [focusedValue] - Optional. Date currently focused (centered) in the calendar view.
 * @param {(date: CalendarDate | null | undefined) => void} [onFocusedValueChange] - Optional. Callback triggered when the focused date changes.
 * @param {DateValue | null} [minValue] - Optional. Minimum selectable date.
 * @param {DateValue | null} [maxValue] - Optional. Maximum selectable date.
 * @param {DateValue | null} [rangeStart] - Optional. Start of the selected date range (for range highlighting).
 * @param {DateValue | null} [rangeEnd] - Optional. End of the selected date range (for range highlighting).
 */
export const FrankCalendar = ({
  variant = 'Default',
  isStartDateSelection,
  value,
  onValueChange,
  focusedValue,
  onFocusedValueChange,
  minValue,
  maxValue,
  rangeStart,
  rangeEnd,
}: Props) => {
  const [focusedValueState, setFocusedValueState] = useControlledState(
    focusedValue,
    dateToCalendarDate(new Date())
  );
  const [valueState, setValueState] = useControlledState(value, null);
  const dateSelectionBtns =
    isStartDateSelection && variant === 'WithShortcut'
      ? [
          {
            label: 'Today',
            onPress: () => {
              if (setValueState) {
                setValueState(currentDay);
              }
              onValueChange?.(currentDay);
            },
          },
          {
            label: 'Next week',
            onPress: () => {
              const currentWeekDay = currentDay.toDate(getLocalTimeZone()).getDay();
              const daysUtilNextMonday = currentWeekDay === 0 ? 1 : 8 - currentWeekDay;
              const nextMonday = currentDay.add({ days: daysUtilNextMonday });
              if (setValueState) {
                setValueState(nextMonday);
              }
              onValueChange?.(nextMonday);
            },
          },
          {
            label: 'Next month',
            onPress: () => {
              const nextMonth = currentDay.add({ months: 1 }).set({ day: 1 });
              if (setValueState) {
                setValueState(nextMonth);
              }
              onValueChange?.(nextMonth);
            },
          },
        ]
      : [
          {
            label: 'No end day',
            onPress: () => {
              const noEnd = currentDay.add({ years: 65 });
              if (setValueState) {
                setValueState(noEnd);
              }
              onValueChange?.(noEnd);
            },
          },
          {
            label: 'End of this month',
            onPress: () => {
              const endOfThisMonth = currentDay
                .add({ months: 1 })
                .set({ day: 1 })
                .subtract({ days: 1 });
              if (setValueState) {
                setValueState(endOfThisMonth);
              }
              onValueChange?.(endOfThisMonth);
            },
          },
          {
            label: 'End of next month',
            onPress: () => {
              const endOfNextMonth = currentDay
                .add({ months: 2 })
                .set({ day: 1 })
                .subtract({ days: 1 });
              if (setValueState) {
                setValueState(endOfNextMonth);
              }
              onValueChange?.(endOfNextMonth);
            },
          },
        ];

  useEffect(() => {
    if (valueState) {
      if (setFocusedValueState) {
        setFocusedValueState(valueState as CalendarDate);
      }
    }
    onFocusedValueChange?.(valueState as CalendarDate);
  }, [valueState, setFocusedValueState, onFocusedValueChange]);

  const calendarDays = calendarData(
    focusedValueState,
    valueState as CalendarDate,
    minValue,
    maxValue,
    rangeStart,
    rangeEnd,
    'en-US',
    getLocalTimeZone()
  );

  return (
    <Card
      shadow={variant === 'Small' ? 'none' : 'sm'}
      className={clsx('select-none', {
        'w-[404px] ah-[232px]': variant === 'WithShortcut',
        'w-[226px] ah-[232px]': variant === 'Default',
        'w-[180px] ah-[200px] bg-transparent': variant === 'Small',
      })}
      radius="md"
    >
      <div className={clsx('flex font-inter font-[450] text-[14px] text-[#303030] h-full', {})}>
        {/* Left Control */}
        <div
          className={clsx(
            'abg-red-300 w-[140px] min-h-max py-3 px-[7px] border-r-1 border-[#E3E3E3]',
            {
              hidden: variant !== 'WithShortcut',
            }
          )}
        >
          {dateSelectionBtns &&
            dateSelectionBtns.map((btn, index) => {
              return (
                <FrankButtonBase
                  customizeContent={<div className="w-full text-left pl-[5px]">{btn.label}</div>}
                  disableRipple
                  variant="light"
                  height={32}
                  radius="sm"
                  onPress={btn.onPress}
                  key={`${btn.label}-${index}`}
                />
              );
            })}
        </div>
        {/* Right Calendar */}
        <div
          className={clsx('flex-1 h-full flex flex-col gap-3', {
            'pt-3 pb-2 px-4': variant === 'Default' || variant === 'WithShortcut',
          })}
        >
          {/* Calendar Header */}
          <div className="flex justify-between items-center abg-red-200 pl-2">
            <div className="font-[500] text-[#14151A]">{`${numberToMonthName(
              focusedValueState.month
            )} ${focusedValueState.year}`}</div>
            <div className="flex gap-2">
              <FrankButtonBase
                customizeContent={<IoIosArrowBack />}
                width={24}
                height={24}
                variant="light"
                disableRipple
                onPress={() => {
                  setFocusedValueState?.(prev => prev.subtract({ months: 1 }));
                  onFocusedValueChange?.(focusedValue);
                }}
              />
              <FrankButtonBase
                customizeContent={<IoIosArrowForward />}
                width={24}
                height={24}
                variant="light"
                disableRipple
                onPress={() => {
                  setFocusedValueState?.(prev => prev.add({ months: 1 }));
                  onFocusedValueChange?.(focusedValue);
                }}
              />
            </div>
          </div>
          {/* Calendar Body */}
          <div className="h-full ">
            {/* Week Name */}
            <div className="grid grid-cols-7">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((weekName, index) => {
                return (
                  <div
                    className="font-[500] font-inter text-[13px] text-[#616161] flex justify-center items-center"
                    key={`${weekName}-${index}`}
                  >
                    <span>{weekName}</span>
                  </div>
                );
              })}
            </div>
            <Spacer y={1} />
            {/* Day Cell */}
            <div className="grid grid-cols-7">
              {calendarDays.map((calendarDay, index) => (
                <div
                  key={`${calendarDay.date.toString()}`}
                  className={clsx(
                    'text-center h-[24px] text-[13px] text-[#303030] flex justify-center items-center mb-1',
                    {
                      'bg-[#E3E3E3]': calendarDay.isHightLight,
                      'rounded-l-lg':
                        (rangeStart && calendarDay.date.compare(rangeStart) === 0) ||
                        index % 7 === 0,
                      'rounded-r-lg':
                        (rangeEnd && calendarDay.date.compare(rangeEnd) === 0) || index % 7 === 6,
                    }
                  )}
                >
                  <div
                    className={clsx(
                      'w-[24px] h-[24px] flex justify-center items-center rounded-full hover:bg-[#0C534F] hover:text-[#E4FFE5] hover:border-1 hover:border-[#E3E3E3]',
                      {
                        'bg-[#003F3C] text-[#E4FFE5]': calendarDay.isToday && !calendarDay.selected,
                        'bg-[#C1EDEA] text-[#003F3C]': calendarDay.selected,
                        'text-[#B5B5B5]': calendarDay.isDisabled,
                        'cursor-pointer': !calendarDay.isDisabled,
                      }
                    )}
                    onClick={() => {
                      if (!calendarDay.isDisabled) {
                        setValueState?.(calendarDay.date);
                        onValueChange?.(calendarDay.date);
                      }
                    }}
                  >
                    <span>{calendarDay.date.day}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FrankCalendar;

type CalendarCellType = {
  date: CalendarDate;
  selected: boolean;
  isToday: boolean;
  isDisabled: boolean;
  isHightLight: boolean;
};

function calendarData(
  date: CalendarDate,
  valueState: CalendarDate,
  minValue: DateValue | undefined | null,
  maxValue: DateValue | undefined | null,
  rangeStart: DateValue | undefined | null,
  rangeEnd: DateValue | undefined | null,
  locale: string,
  timeZone: string
): CalendarCellType[] {
  // 该月第一天
  const firstDayOfMonth = startOfMonth(date);
  // 该月第一天是周几
  const weekday = getDayOfWeek(firstDayOfMonth, locale);
  // 计算日历的起始点
  const calendarStart = firstDayOfMonth.subtract({ days: weekday });

  // 该月最后一天
  const lastDayofMonth = endOfMonth(date);
  // 计算该月最后一天是周几
  const lastWeekday = getDayOfWeek(lastDayofMonth, locale);
  // 计算日历的结尾点
  const calendarEnd = lastDayofMonth.add({ days: 6 - lastWeekday });

  let current = calendarStart;
  const days: CalendarCellType[] = [];
  while (current.compare(calendarEnd) <= 0) {
    const dayCell: CalendarCellType = {
      date: current,
      selected: valueState ? current.compare(valueState) === 0 : false,
      isToday: current.compare(today(timeZone)) === 0,
      isDisabled:
        current.compare(firstDayOfMonth) < 0 ||
        current.compare(lastDayofMonth) > 0 ||
        (minValue ? current.compare(minValue) < 0 : false) ||
        (maxValue ? current.compare(maxValue) > 0 : false),
      isHightLight:
        rangeStart && rangeEnd
          ? current.compare(rangeStart) >= 0 && current.compare(rangeEnd) <= 0
          : false,
    };
    days.push(dayCell);
    current = current.add({ days: 1 });
  }

  return days;
}
