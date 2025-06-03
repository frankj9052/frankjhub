import { Card } from '@heroui/react';
import { addDays, compareAsc, format, isSameDay, isSameWeek, subDays } from 'date-fns';
import TimeGridWeek from './FrankBigCalendarParts/TimeGridWeek';
import TimeGridDay from './FrankBigCalendarParts/TimeGridDay';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ListDay from './FrankBigCalendarParts/ListDay';
import clsx from 'clsx';
import { BookingEventActionsType } from './FrankBigCalendarParts/ListDayBookingEvent';
import { useControlledState } from '../../../useHooks';
import { FrankButtonBase } from '../../general';
import { CalendarViewSwitcher, FrankArrowSwitcher } from '../../navigation';

export type ViewType = 'timeGridWeek' | 'timeGridDay' | 'listDay';
export type BookingStatus =
  | 'AVAILABLE'
  | 'BOOKED'
  | 'UNAVAILABLE'
  | 'PENDING'
  | 'CANCELLED'
  | 'ARRIVED'
  | 'COMPLETE'
  | 'MISS';
export type BookingMethod = 'PHONE' | 'ONLINE';
export type BookingServiceType = 'General Visit';
export type LocationType = {
  id: string;
  country: string;
  province: string;
  city: string;
  address: string;
  label: string;
  unit?: string;
  room?: string;
  notes?: string;
};
export type BookingType = {
  startTime: Date;
  endTime: Date;
  clientUserId?: string;
  clientName?: string;
  location?: string;
  bookingMethod?: BookingMethod[];
  clientGender?: string;
  clientAge?: number;
  providerName?: string;
  providerUserId?: string;
  id: string;
  src?: string;
  status: BookingStatus;
  room?: string;
  serviceType?: BookingServiceType;
};
export type ShiftType = {
  startTime: Date;
  endTime: Date;
  photo: string;
  providerUserId: string;
  providerName?: string;
  backgroundColor: string;
  bookings?: BookingType[];
  location?: LocationType;
};

export type FrankBigCalendarProps = {
  width?: number;
  height?: number;
  currentView?: ViewType;
  onCurrentViewChange?: (viewType: ViewType) => void;
  focusedDate?: Date;
  onFocusedDateChange?: (newDate: Date) => void;
  shiftsData?: ShiftType[];
  bookingEventActions?: BookingEventActionsType;
};

/**
 * A fully-featured calendar component that supports multiple views (week grid, day grid, list day),
 * with built-in navigation, date control, and drag-and-drop capabilities.
 *
 * @param {number} [width] - Optional. Width of the calendar in pixels.
 * @param {number} [height] - Optional. Height of the calendar in pixels.
 * @param {ViewType} [currentView] - Optional. Current active view type ('timeGridWeek', 'timeGridDay', or 'listDay').
 * @param {(viewType: ViewType) => void} [onCurrentViewChange] - Optional. Callback triggered when the view type changes.
 * @param {Date} [focusedDate] - Optional. Current focused date displayed in the calendar.
 * @param {(newDate: Date) => void} [onFocusedDateChange] - Optional. Callback triggered when the focused date changes.
 * @param {ShiftType[]} [shiftsData] - Optional. Shift and booking data to populate the calendar.
 * @param {BookingEventActionsType} [bookingEventActions] - Optional. Actions available for bookings in the list view (edit, cancel, etc.).
 */
export function FrankBigCalendar({
  width,
  height,
  currentView,
  onCurrentViewChange,
  focusedDate,
  onFocusedDateChange,
  shiftsData = [],
  bookingEventActions,
}: FrankBigCalendarProps) {
  const [currentViewState, setCurrentViewState] = useControlledState<ViewType>(
    currentView,
    'timeGridWeek'
  );
  const [focusedDateState, setFocusedDateState] = useControlledState(focusedDate, new Date());

  const focusedDayShifts = shiftsData.filter(shift => isSameDay(shift.startTime, focusedDateState));
  const focusedDayBookings: BookingType[] = focusedDayShifts
    .reduce((acc: BookingType[], shift) => {
      const bookings: BookingType[] =
        shift.bookings
          ?.filter(booking =>
            ['BOOKED', 'PENDING', 'ARRIVED', 'COMPLETE', 'MISS'].includes(booking.status)
          )
          .map(booking => ({
            ...booking,
            providerName: shift.providerName,
            providerUserId: shift.providerUserId,
            room: shift.location?.room || 'Without room assignment',
          })) || [];
      acc.push(...bookings);
      return acc;
    }, [])
    .sort((a, b) => compareAsc(new Date(a.startTime), new Date(b.startTime)));

  const getDateBasedOnView = (date: Date): string => {
    switch (currentViewState) {
      case 'timeGridWeek':
        return `${format(date, 'MMMM')} ${format(date, 'yyyy')}`;
      default:
        return `${format(date, 'dd')} ${format(date, 'MMMM')} ${format(date, 'yyyy')}`;
    }
  };

  const getCalendar = (view: ViewType) => {
    switch (view) {
      case 'timeGridWeek':
        return (
          <TimeGridWeek
            shiftsData={shiftsData.filter(shift => isSameWeek(shift.startTime, focusedDateState))}
            startHour={0}
            endHour={24}
            focusedDate={focusedDateState}
          />
        );
      case 'timeGridDay':
        return <TimeGridDay shiftsData={focusedDayShifts} startHour={0} endHour={24} />;
      case 'listDay':
        return (
          <ListDay bookingData={focusedDayBookings} bookingEventActions={bookingEventActions} />
        );
      default:
        return <div>wrong view</div>;
    }
  };

  // 切换视图
  return (
    <DndProvider backend={HTML5Backend}>
      <Card
        style={{
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : '100%',
        }}
        shadow="sm"
      >
        {/* Calendar Controller */}
        <div
          className={`flex justify-between items-center ${
            currentViewState === 'listDay' ? 'pb-2' : 'pb-4'
          } px-4 pt-4`}
        >
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
        {/* Calendar Body */}
        <div
          className={clsx('min-h-[calc(100%-48px)]', {
            'px-4 pb-10': currentViewState !== 'listDay',
          })}
        >
          {getCalendar(currentViewState)}
        </div>
      </Card>
    </DndProvider>
  );
}

export default FrankBigCalendar;
