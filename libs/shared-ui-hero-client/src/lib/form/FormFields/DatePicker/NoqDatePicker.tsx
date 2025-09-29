import { ReactNode, useEffect, useRef, useState } from 'react';
import { DateValue, Spacer } from '@heroui/react';
import { parseDate } from '@internationalized/date';
import clsx from 'clsx';
import { formatNumberString, isValidDate } from '@frankjhub/shared-utils';
import { useClickOutside, useControlledState } from '@frankjhub/shared-hooks';
import { FrankPopoverGeneral } from '../../feedback';
import { FrankSVGIcon } from '@frankjhub/shared-ui-core';
import { FrankCalendar } from '../../dataDisplay';

type DateInputType = {
  year: string;
  month: string;
  day: string;
};

/**
 * A customized date picker component that combines manual text input (year, month, day)
 * with a popover calendar for flexible date selection, validation, and range checking.
 *
 * @param {number} [width] - Optional. Width of the date picker in pixels.
 * @param {number} [height] - Optional. Height of the date picker in pixels.
 * @param {ReactNode} [endContent] - Optional. Custom content to display at the end (e.g., icon).
 * @param {DateValue | null} [value] - Optional. Controlled selected date value.
 * @param {(value: DateValue | null | undefined) => void} [onValueChange] - Optional. Callback triggered when the selected date changes.
 * @param {boolean} [isStartDateSelection] - Optional. Whether the date picker is used for selecting a start date (affects shortcut options).
 * @param {number} [zIndex] - Optional. z-index of the popover calendar for layering control.
 * @param {DateValue | null} [minValue] - Optional. Minimum selectable date.
 * @param {DateValue | null} [maxValue] - Optional. Maximum selectable date.
 * @param {DateValue | null} [rangeStart] - Optional. Start of a date range for highlighting.
 * @param {DateValue | null} [rangeEnd] - Optional. End of a date range for highlighting.
 */
export type NoqDatePickerProps = {
  width?: number;
  height?: number;
  endContent?: ReactNode;
  value?: DateValue | null;
  onValueChange?: (value: DateValue | null | undefined) => void;
  isStartDateSelection?: boolean;
  zIndex?: number;
  minValue?: DateValue | null;
  maxValue?: DateValue | null;
  rangeStart?: DateValue | null;
  rangeEnd?: DateValue | null;
};

export function NoqDatePicker({
  width,
  height,
  endContent,
  value,
  onValueChange,
  isStartDateSelection,
  zIndex,
  minValue,
  maxValue,
  rangeStart,
  rangeEnd,
}: NoqDatePickerProps) {
  // input的值输入前是否清空
  const [shouldClearOnInput, setShouldClearOnInput] = useState<{
    year: boolean;
    month: boolean;
    day: boolean;
  }>({
    year: false,
    month: false,
    day: false,
  });
  // 日历开关
  const [isOpen, setIsOpen] = useState(false);
  // 日历的值
  const [valueState, setValueState] = useControlledState(value, null);

  // input中输入的值
  const [inputValue, setInputValue] = useState<DateInputType>({
    year: valueState?.year ? valueState.year.toString() : '',
    month: valueState?.month ? valueState.month.toString() : '',
    day: valueState?.day ? valueState.day.toString() : '',
  });
  // input输入完毕自动跳转下一个
  const yearRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

  // 绑定trigger和content, 监听点击外部事件来关闭日历
  const popoverRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(popoverRef, () => setIsOpen(false));

  // 错误状态
  const [error, setError] = useState(false);

  // input日期影响日历
  useEffect(() => {
    if (
      inputValue.year &&
      inputValue.month &&
      inputValue.day &&
      inputValue.year.length === 4 &&
      inputValue.month.length === 2 &&
      inputValue.day.length === 2 &&
      (+inputValue.year !== valueState?.year ||
        +inputValue.month !== valueState?.month ||
        +inputValue.day !== valueState?.day) &&
      isValidDate(`${inputValue.year}-${inputValue.month}-${inputValue.day}`)
    ) {
      setValueState?.(parseDate(`${inputValue.year}-${inputValue.month}-${inputValue.day}`));
      onValueChange?.(parseDate(`${inputValue.year}-${inputValue.month}-${inputValue.day}`));
    }
  }, [
    inputValue.day,
    inputValue.month,
    inputValue.year,
    valueState,
    inputValue,
    onValueChange,
    setValueState,
  ]);

  // 超出范围给与错误状态
  useEffect(() => {
    const lessThanMinValue = minValue && valueState && valueState.compare(minValue) < 0;
    const greaterThanMaxValue = maxValue && valueState && valueState.compare(maxValue) > 0;
    if (lessThanMinValue || greaterThanMaxValue) {
      setError(true);
    } else {
      setError(false);
    }
  }, [minValue, valueState, maxValue]);

  return (
    <div ref={popoverRef}>
      <FrankPopoverGeneral
        popoverTrigger={
          <div
            style={{
              width: width ? `${width}px` : '100%',
              height: height ? `${height}px` : '32px',
            }}
            className={clsx(
              'bg-[#FFF] rounded-md pl-2 pr-[6px] py-[6px] flex items-center justify-between select-none border-1',
              {
                ' border-[#B5B5B5]': !error,
                'border-[#F31260] text-[#F31260]': error,
              }
            )}
          >
            {/* date input */}
            <div className="h-full flex items-center justify-start">
              {/* Year Input */}
              <input
                className={clsx(
                  'w-[35%] h-full focus:outline-none font-inter text-[13px] focus:bg-gray-100 rounded-md caret-transparent text-center cursor-pointer',
                  {
                    'text-[#303030]': !error,
                    'text-[#F31260]': error,
                  }
                )}
                type="text"
                onFocus={() => {
                  setIsOpen(true);
                  setShouldClearOnInput(prev => ({
                    ...prev,
                    year: true,
                  }));
                }}
                onBlur={() => {
                  setShouldClearOnInput(prev => ({
                    ...prev,
                    year: false,
                  }));
                }}
                value={inputValue.year}
                onChange={e => {
                  const inputEvent = e.nativeEvent as InputEvent;
                  const lastInputNumber = inputEvent.data ? +inputEvent.data : null;
                  let newYearValue = inputValue.year;
                  if (
                    shouldClearOnInput.year &&
                    lastInputNumber &&
                    lastInputNumber !== 0 &&
                    !isNaN(lastInputNumber)
                  ) {
                    newYearValue = '' + lastInputNumber;
                    setShouldClearOnInput(prev => ({
                      ...prev,
                      year: false,
                    }));
                  }

                  if (
                    !shouldClearOnInput.year &&
                    lastInputNumber !== null &&
                    !isNaN(lastInputNumber)
                  ) {
                    if (newYearValue.length < 1) {
                      newYearValue = lastInputNumber ? `${lastInputNumber}` : '';
                      setShouldClearOnInput(prev => ({
                        ...prev,
                        year: false,
                      }));
                    } else if (newYearValue.length < 3) {
                      newYearValue += lastInputNumber;
                      setShouldClearOnInput(prev => ({
                        ...prev,
                        year: false,
                      }));
                    } else if (
                      newYearValue.length < 4 &&
                      isValidDate(`${newYearValue + lastInputNumber}-01-01`)
                    ) {
                      newYearValue += lastInputNumber;
                      setShouldClearOnInput(prev => ({
                        ...prev,
                        year: false,
                      }));
                      monthRef.current?.focus();
                    } else {
                      newYearValue = '' + lastInputNumber;
                      setShouldClearOnInput(prev => ({
                        ...prev,
                        year: false,
                      }));
                    }
                  }
                  setInputValue(prev => ({
                    ...prev,
                    year: newYearValue,
                  }));
                }}
                placeholder="YYYY"
                ref={yearRef}
              />
              <span>-</span>
              {/* Month Input */}
              <input
                className={clsx(
                  'w-[22%] h-full focus:outline-none font-inter text-[13px] focus:bg-gray-100 rounded-md caret-transparent text-center cursor-pointer',
                  {
                    'text-[#303030]': !error,
                    'text-[#F31260]': error,
                  }
                )}
                type="text"
                onFocus={() => {
                  setIsOpen(true);
                  setShouldClearOnInput(prev => ({
                    ...prev,
                    month: true,
                  }));
                }}
                onBlur={() => {
                  setShouldClearOnInput(prev => ({
                    ...prev,
                    month: false,
                  }));
                }}
                value={
                  inputValue.month ? formatNumberString(inputValue.month, 2) : inputValue.month
                }
                onChange={e => {
                  const inputEvent = e.nativeEvent as InputEvent;
                  const lastInputNumber = inputEvent.data ? +inputEvent.data : null;
                  let newMonthValue = inputValue.month;
                  if (
                    shouldClearOnInput.month &&
                    lastInputNumber !== null &&
                    !isNaN(lastInputNumber)
                  ) {
                    newMonthValue = formatNumberString(lastInputNumber, 2);
                    setShouldClearOnInput(prev => ({
                      ...prev,
                      month: false,
                    }));
                    if (lastInputNumber && lastInputNumber !== 1) {
                      dayRef.current?.focus();
                    }
                  }

                  if (
                    !shouldClearOnInput.month &&
                    lastInputNumber !== null &&
                    !isNaN(lastInputNumber)
                  ) {
                    const newValue = `${+newMonthValue}` + lastInputNumber;
                    if (isValidDate(`2025-${newValue}-01`)) {
                      newMonthValue = formatNumberString(newValue, 2);
                    } else {
                      newMonthValue = formatNumberString(lastInputNumber, 2);
                    }
                    dayRef.current?.focus();
                    setShouldClearOnInput(prev => ({
                      ...prev,
                      month: false,
                    }));
                  }
                  setInputValue(prev => ({
                    ...prev,
                    month: newMonthValue,
                  }));
                }}
                placeholder="MM"
                ref={monthRef}
              />
              <span>-</span>
              {/* Day Input */}
              <input
                className={clsx(
                  'w-[20%] h-full focus:outline-none font-inter text-[13px] focus:bg-gray-100 rounded-md caret-transparent text-center cursor-pointer',
                  {
                    'text-[#303030]': !error,
                    'text-[#F31260]': error,
                  }
                )}
                type="text"
                onFocus={() => {
                  setIsOpen(true);
                  setShouldClearOnInput(prev => ({
                    ...prev,
                    day: true,
                  }));
                }}
                onBlur={() => {
                  setShouldClearOnInput(prev => ({
                    ...prev,
                    day: false,
                  }));
                }}
                value={inputValue.day ? formatNumberString(inputValue.day, 2) : inputValue.day}
                onChange={e => {
                  const inputEvent = e.nativeEvent as InputEvent;
                  const lastInputNumber = inputEvent.data ? +inputEvent.data : null;
                  let newDayValue = inputValue.day;
                  if (
                    shouldClearOnInput.day &&
                    lastInputNumber !== null &&
                    !isNaN(lastInputNumber)
                  ) {
                    newDayValue = formatNumberString(lastInputNumber, 2);
                    setShouldClearOnInput(prev => ({
                      ...prev,
                      day: false,
                    }));
                    if (lastInputNumber > 3) {
                      dayRef.current?.blur();
                    }
                  }

                  if (
                    !shouldClearOnInput.day &&
                    lastInputNumber !== null &&
                    !isNaN(lastInputNumber)
                  ) {
                    const newValue = `${+newDayValue}` + lastInputNumber;
                    if (
                      isValidDate(
                        `${inputValue.year || '2025'}-${inputValue.month || '01'}-${newValue}`
                      )
                    ) {
                      newDayValue = formatNumberString(newValue, 2);
                    } else {
                      newDayValue = formatNumberString(lastInputNumber, 2);
                    }
                    setShouldClearOnInput(prev => ({
                      ...prev,
                      day: false,
                    }));
                    dayRef.current?.blur();
                  }
                  setInputValue(prev => ({
                    ...prev,
                    day: newDayValue,
                  }));
                }}
                placeholder="DD"
                ref={dayRef}
              />
            </div>
            {/* end content */}
            <div
              className="cursor-pointer text-[#4A4A4A]"
              onClick={() => {
                setIsOpen(prev => !prev);
              }}
            >
              {endContent ? (
                endContent
              ) : (
                <FrankSVGIcon
                  viewBox="0 0 25 24"
                  width={24}
                  height={24}
                  fill={error ? '#F31260' : '#4A4A4A'}
                >
                  <path
                    d="M5.80775 21.5C5.30258 21.5 4.875 21.325 4.525 20.975C4.175 20.625 4 20.1974 4 19.6923V6.30777C4 5.8026 4.175 5.37502 4.525 5.02502C4.875 4.67502 5.30258 4.50002 5.80775 4.50002H7.19225V3.15377C7.19225 2.9346 7.26567 2.7516 7.4125 2.60477C7.55933 2.4581 7.74233 2.38477 7.9615 2.38477C8.18083 2.38477 8.36383 2.4581 8.5105 2.60477C8.65733 2.7516 8.73075 2.9346 8.73075 3.15377V4.50002H16.3077V3.13477C16.3077 2.92193 16.3795 2.74368 16.523 2.60002C16.6667 2.45652 16.8449 2.38477 17.0577 2.38477C17.2706 2.38477 17.4487 2.45652 17.5922 2.60002C17.7359 2.74368 17.8077 2.92193 17.8077 3.13477V4.50002H19.1923C19.6974 4.50002 20.125 4.67502 20.475 5.02502C20.825 5.37502 21 5.8026 21 6.30777V19.6923C21 20.1974 20.825 20.625 20.475 20.975C20.125 21.325 19.6974 21.5 19.1923 21.5H5.80775ZM5.80775 20H19.1923C19.2692 20 19.3398 19.9679 19.4038 19.9038C19.4679 19.8398 19.5 19.7693 19.5 19.6923V10.3078H5.5V19.6923C5.5 19.7693 5.53208 19.8398 5.59625 19.9038C5.66025 19.9679 5.73075 20 5.80775 20ZM5.5 8.80777H19.5V6.30777C19.5 6.23077 19.4679 6.16026 19.4038 6.09626C19.3398 6.0321 19.2692 6.00002 19.1923 6.00002H5.80775C5.73075 6.00002 5.66025 6.0321 5.59625 6.09626C5.53208 6.16026 5.5 6.23077 5.5 6.30777V8.80777ZM12.5 14.077C12.2552 14.077 12.0465 13.9908 11.874 13.8183C11.7017 13.6459 11.6155 13.4373 11.6155 13.1923C11.6155 12.9474 11.7017 12.7388 11.874 12.5663C12.0465 12.3939 12.2552 12.3078 12.5 12.3078C12.7448 12.3078 12.9535 12.3939 13.126 12.5663C13.2983 12.7388 13.3845 12.9474 13.3845 13.1923C13.3845 13.4373 13.2983 13.6459 13.126 13.8183C12.9535 13.9908 12.7448 14.077 12.5 14.077ZM8.5 14.077C8.25517 14.077 8.0465 13.9908 7.874 13.8183C7.70167 13.6459 7.6155 13.4373 7.6155 13.1923C7.6155 12.9474 7.70167 12.7388 7.874 12.5663C8.0465 12.3939 8.25517 12.3078 8.5 12.3078C8.74483 12.3078 8.9535 12.3939 9.126 12.5663C9.29833 12.7388 9.3845 12.9474 9.3845 13.1923C9.3845 13.4373 9.29833 13.6459 9.126 13.8183C8.9535 13.9908 8.74483 14.077 8.5 14.077ZM16.5 14.077C16.2552 14.077 16.0465 13.9908 15.874 13.8183C15.7017 13.6459 15.6155 13.4373 15.6155 13.1923C15.6155 12.9474 15.7017 12.7388 15.874 12.5663C16.0465 12.3939 16.2552 12.3078 16.5 12.3078C16.7448 12.3078 16.9535 12.3939 17.126 12.5663C17.2983 12.7388 17.3845 12.9474 17.3845 13.1923C17.3845 13.4373 17.2983 13.6459 17.126 13.8183C16.9535 13.9908 16.7448 14.077 16.5 14.077ZM12.5 18C12.2552 18 12.0465 17.9138 11.874 17.7413C11.7017 17.5689 11.6155 17.3603 11.6155 17.1155C11.6155 16.8705 11.7017 16.6618 11.874 16.4895C12.0465 16.317 12.2552 16.2308 12.5 16.2308C12.7448 16.2308 12.9535 16.317 13.126 16.4895C13.2983 16.6618 13.3845 16.8705 13.3845 17.1155C13.3845 17.3603 13.2983 17.5689 13.126 17.7413C12.9535 17.9138 12.7448 18 12.5 18ZM8.5 18C8.25517 18 8.0465 17.9138 7.874 17.7413C7.70167 17.5689 7.6155 17.3603 7.6155 17.1155C7.6155 16.8705 7.70167 16.6618 7.874 16.4895C8.0465 16.317 8.25517 16.2308 8.5 16.2308C8.74483 16.2308 8.9535 16.317 9.126 16.4895C9.29833 16.6618 9.3845 16.8705 9.3845 17.1155C9.3845 17.3603 9.29833 17.5689 9.126 17.7413C8.9535 17.9138 8.74483 18 8.5 18ZM16.5 18C16.2552 18 16.0465 17.9138 15.874 17.7413C15.7017 17.5689 15.6155 17.3603 15.6155 17.1155C15.6155 16.8705 15.7017 16.6618 15.874 16.4895C16.0465 16.317 16.2552 16.2308 16.5 16.2308C16.7448 16.2308 16.9535 16.317 17.126 16.4895C17.2983 16.6618 17.3845 16.8705 17.3845 17.1155C17.3845 17.3603 17.2983 17.5689 17.126 17.7413C16.9535 17.9138 16.7448 18 16.5 18Z"
                    fill="#4A4A4A"
                  />
                </FrankSVGIcon>
              )}
            </div>
          </div>
        }
        popoverContent={
          <div>
            <Spacer y={2} />
            <FrankCalendar
              value={valueState}
              onValueChange={value => {
                setValueState?.(value ?? null);
                onValueChange?.(value);
                if (value?.year && value.month && value.day) {
                  setInputValue({
                    year: value.year.toString(),
                    month: formatNumberString(value.month.toString(), 2),
                    day: formatNumberString(value.day.toString(), 2),
                  });
                  setIsOpen(false);
                }
              }}
              variant="WithShortcut"
              isStartDateSelection={isStartDateSelection}
              minValue={minValue}
              maxValue={maxValue}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
            />
          </div>
        }
        isOpen={isOpen}
        zIndex={zIndex}
      />
    </div>
  );
}

export default NoqDatePicker;
