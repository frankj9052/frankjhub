import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import styles from './FrankFullCalendar.module.css';
import { useEffect, useRef } from 'react';
import { addDays, format, isSameDay, subDays } from 'date-fns';
import clsx from 'clsx';
import { useControlledState } from '../../../useHooks';
import { FrankButtonBase } from '../../general';
import { CalendarViewSwitcher, FrankArrowSwitcher } from '../../navigation';

export type FrankFullCalendarProps = {
  width?: number;
  height?: number;
  currentView?: CurrentViewType;
  onCurrentViewChange?: (viewType: CurrentViewType) => void;
  focusedDate?: Date;
  onFocusedDateChange?: (newDate: Date) => void;
};

type CurrentViewType = 'timeGridWeek' | 'timeGridDay' | 'listDay';

/**
 * A customized FullCalendar component wrapper with added header controls for
 * date navigation, view switching, and styling integration using FullCalendar plugins.
 *
 * @param {number} [width] - Optional. Width of the calendar container in pixels.
 * @param {number} [height] - Optional. Height of the calendar container in pixels.
 * @param {CurrentViewType} [currentView] - Optional. Current active view type ('timeGridWeek', 'timeGridDay', or 'listDay').
 * @param {(viewType: CurrentViewType) => void} [onCurrentViewChange] - Optional. Callback triggered when the calendar view changes.
 * @param {Date} [focusedDate] - Optional. Current focused date displayed in the calendar.
 * @param {(newDate: Date) => void} [onFocusedDateChange] - Optional. Callback triggered when the focused date changes.
 */
export function FrankFullCalendar({
  width,
  height,
  currentView,
  onCurrentViewChange,
  focusedDate,
  onFocusedDateChange,
}: FrankFullCalendarProps) {
  const calendarWrapperRef = useRef<HTMLDivElement | null>(null);
  const calendarRef = useRef<FullCalendar | null>(null);
  const [currentViewState, setCurrentViewState] = useControlledState(currentView, 'timeGridWeek');
  const [focusedDateState, setFocusedDateState] = useControlledState(focusedDate, new Date());

  // 切换视图
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(currentViewState);
    }
  }, [currentViewState]);

  // 切换焦点日期
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(focusedDateState);
    }
  });

  // 添加元素类名
  // useEffect(() => {
  //     if (calendarWrapperRef.current) {
  //         const fcEvents = calendarWrapperRef.current.querySelectorAll('.fc-event');
  //         if (fcEvents && fcEvents.length > 0) {
  //             fcEvents.forEach((fcEvents) => fcEvents.classList.add(styles['fc-event']));
  //         }
  //     }
  // }, [])

  const getDateBasedOnView = (date: Date): string => {
    switch (currentViewState) {
      case 'timeGridWeek':
        return `${format(date, 'MMMM')} ${format(date, 'yyyy')}`;
      default:
        return `${format(date, 'dd')} ${format(date, 'MMMM')} ${format(date, 'yyyy')}`;
    }
  };
  return (
    <div
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
      }}
      className={`${styles.fullCalendar} font-inter flex flex-col`}
      ref={calendarWrapperRef}
    >
      {/* Customer Header */}
      <div className="flex justify-between items-center py-4">
        {/* Date */}
        <div className="font-[500] text-2xl tracking-[-0.2px] text-[#303030]">
          {getDateBasedOnView(focusedDateState)}
        </div>
        {/* Control */}
        <div className="flex gap-3">
          <FrankButtonBase
            customizeContent={
              <div className="font-inter text-[13px] text-[#303030] font-[500]">Today</div>
            }
            variant="bordered"
            height={32}
            width={62}
            disableRipple
            backgroundColor="#FFF"
            radius="sm"
            onPress={() => {
              setFocusedDateState?.(new Date());
              onFocusedDateChange?.(new Date());
            }}
          />
          <FrankArrowSwitcher
            handleLeftArrowClick={() => {
              if (currentViewState === 'timeGridWeek') {
                setFocusedDateState?.(subDays(focusedDateState, 7));
                onFocusedDateChange?.(subDays(focusedDateState, 7));
                return;
              }
              setFocusedDateState?.(subDays(focusedDateState, 1));
              onFocusedDateChange?.(subDays(focusedDateState, 1));
            }}
            handleRightArrowClick={() => {
              if (currentViewState === 'timeGridWeek') {
                setFocusedDateState?.(addDays(focusedDateState, 7));
                onFocusedDateChange?.(addDays(focusedDateState, 7));
                return;
              }
              setFocusedDateState?.(addDays(focusedDateState, 1));
              onFocusedDateChange?.(addDays(focusedDateState, 1));
            }}
          />
          <CalendarViewSwitcher
            handleClickLeftButton={() => {
              setCurrentViewState?.('listDay');
              onCurrentViewChange?.('listDay');
            }}
            handleClickMiddleButton={() => {
              setCurrentViewState?.('timeGridDay');
              onCurrentViewChange?.('timeGridDay');
            }}
            handleClickRightButton={() => {
              setCurrentViewState?.('timeGridWeek');
              onCurrentViewChange?.('timeGridWeek');
            }}
          />
        </div>
      </div>

      <FullCalendar
        ref={calendarRef}
        titleFormat={{
          year: 'numeric',
          month: 'long',
        }}
        height="100%"
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin, listPlugin]}
        initialView="timeGridWeek"
        headerToolbar={false}
        weekends={true}
        allDaySlot={false}
        nowIndicator={true} // 当前时间红线
        editable={true}
        eventClassNames={styles['fc-event']}
        events={[
          {
            id: '1',
            title: 'nothing',
            start: '2025-03-31T10:00:00',
            end: '2025-03-31T11:00:00',
            color: 'transparent',
          },
          {
            id: '2',
            title: 'nothing',
            start: '2025-03-31T12:00:00',
            end: '2025-03-31T13:00:00',
            color: '#C53000',
          },
        ]}
        slotLabelContent={args => {
          const hour = args.date.getHours();
          return (
            <div className="text-[12px] leading-[16px] text-[#616161] select-none">{hour}</div>
          );
        }}
        dayHeaderContent={args => {
          return (
            <div
              className={clsx(
                'flex gap-1 font-[550] font-inter text-[12px] leading-[16px] tracking-[0px] text-[#003F3C] py-[5px] select-none',
                {
                  'text-[#003F3C] font-bold': isSameDay(args.date, new Date()),
                }
              )}
            >
              <span>{args.date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <div>{args.date.getDate()}</div>
            </div>
          );
        }}
        eventContent={() => {
          return (
            <div className="absolute left-[-1px] top-[-1px] right-[-1px] bottom-[-1px] bg-blue-200"></div>
          );
        }}
      />
    </div>
  );
}

export default FrankFullCalendar;
