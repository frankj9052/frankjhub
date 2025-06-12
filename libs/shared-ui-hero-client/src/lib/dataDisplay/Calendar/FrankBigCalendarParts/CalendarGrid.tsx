import { forwardRef, useImperativeHandle, useRef } from 'react';

export type CalendarGridProps = {
  width?: number;
  startHour?: number; // default 0
  endHour?: number; // default 24
  intervalPerHour?: number; // 一小时分几格，默认2（每30分钟）
  columnCount: number; // 几列， 1=dayView, 7=weekView
};

export type CalendarGridRef = {
  getHeight: () => number | null;
  getWidth: () => number | null;
};

/**
 * CalendarGrid - A flexible grid component for calendar layouts.
 * Renders a grid with customizable rows and columns based on time intervals and view type (e.g., day view, week view).
 * Exposes grid dimensions through an imperative handle for parent components.
 *
 * @component
 * @param {CalendarGridProps} props - Component props
 * @param {number} [props.width] - Optional. Width of the calendar grid in pixels.
 * @param {number} [props.startHour=0] - Optional. Start hour for the grid rows (default is 0).
 * @param {number} [props.endHour=24] - Optional. End hour for the grid rows (default is 24).
 * @param {number} [props.intervalPerHour=2] - Optional. Number of intervals per hour (default is 2; e.g., 30-minute slots).
 * @param {number} props.columnCount - Required. Number of columns in the grid (1 for day view, 7 for week view, etc.).
 *
 * @ref {CalendarGridRef} - Provides methods `getHeight()` and `getWidth()` to retrieve grid dimensions.
 *
 * @returns {JSX.Element} The CalendarGrid component.
 */
export const CalendarGrid = forwardRef<CalendarGridRef, CalendarGridProps>(
  ({ width, startHour = 0, endHour = 24, intervalPerHour = 2, columnCount }, ref) => {
    const totalRows = (endHour - startHour) * intervalPerHour;
    const gridRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => ({
      getHeight: () => gridRef.current?.offsetHeight ?? null,
      getWidth: () => gridRef.current?.offsetWidth ?? null,
    }));

    return (
      <div
        className="grid border-t border-l border-gray-200 min-h-full relative"
        style={{
          width: width ? `${width}px` : '100%',
          gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
          gridTemplateRows: `repeat(${totalRows}, minmax(25px, 1fr))`,
        }}
        ref={gridRef}
      >
        {Array.from({ length: columnCount * totalRows }).map((_, index) => (
          <div key={index} className="border-gray-200 border-b border-r" />
        ))}
      </div>
    );
  }
);

export default CalendarGrid;
