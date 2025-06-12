export const TIMESCALE_WIDTH = 32;

export type TimeScaleProps = {
  startHour?: number;
  endHour?: number;
  rowHeight?: number; // 每小时的高度
};

/**
 * TimeScale - A vertical time scale component that displays hourly labels alongside the calendar grid.
 *
 * @component
 * @param {TimeScaleProps} props - Component props
 * @param {number} [props.startHour=0] - Optional. Starting hour of the time scale (default is 0).
 * @param {number} [props.endHour=24] - Optional. Ending hour of the time scale (default is 24).
 * @param {number} [props.rowHeight=25] - Optional. Height of each hourly row in pixels (default is 25px).
 *
 * @returns {JSX.Element} The TimeScale component.
 */
export function TimeScale({ startHour = 0, endHour = 24, rowHeight = 25 }: TimeScaleProps) {
  const totalIntervals = endHour - startHour;

  const hours = Array.from({ length: totalIntervals }).map((_, i) => {
    const hour = startHour + i;
    return hour.toString();
  });
  return (
    <div className={`grid text-sm font-inter h-full w-[${TIMESCALE_WIDTH}px]`} style={{}}>
      {hours.map((hour, i) => (
        <div
          key={i}
          className="flex justify-end pr-2 items-start select-none"
          style={{
            height: `${rowHeight}px`,
            gridTemplateRows: `repeat(${totalIntervals}, minmax(25px, 1fr))`,
          }}
        >
          {hour === '0' ? '' : hour}
        </div>
      ))}
    </div>
  );
}

export default TimeScale;
