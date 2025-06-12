import { ShiftType } from '../FrankBigCalendar';
import clsx from 'clsx';
import { BiBlock } from 'react-icons/bi';
import {
  convertHexToRGBA,
  getEventHeight,
  getTopOffset,
  shiftColor,
} from '@frankjhub/shared-utils';
import { FrankSVGIcon } from '@frankjhub/shared-ui-core';

// 把svg转换成Data URI(优化编码并压缩)
const svgPattern = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2472_53372)">
<path d="M-16 76L48 12" stroke="black" stroke-opacity="0.06"/>
<path d="M-16 68L48 4.00001" stroke="black" stroke-opacity="0.06"/>
<path d="M-16 60L48 -3.99999" stroke="black" stroke-opacity="0.06"/>
<path d="M-16 52L48 -12" stroke="black" stroke-opacity="0.06"/>
<path d="M-16 44L48 -20" stroke="black" stroke-opacity="0.06"/>
<path d="M-16 36L48 -28" stroke="black" stroke-opacity="0.06"/>
<path d="M-16 28L48 -36" stroke="black" stroke-opacity="0.06"/>
<path d="M-16 20L48 -44" stroke="black" stroke-opacity="0.06"/>
</g>
<defs>
<clipPath id="clip0_2472_53372">
<rect width="32" height="32" fill="white" transform="matrix(-1 0 0 1 32 0)"/>
</clipPath>
</defs>
</svg>`;
const encodedSVG = encodeURIComponent(svgPattern).replace(/'/g, '%27').replace(/"/g, '%22');
const backgroundImage = `url("data:image/svg+xml,${encodedSVG}")`;

export type CalendarShiftComponentProps = {
  width?: number;
  height?: number;
  shift: ShiftType;
  rowHeight: number;
  intervalPerHour: number;
};

/**
 * CalendarShiftComponent - Displays a doctor's shift block within the calendar grid.
 * Renders bookings inside the shift with dynamic positioning, background colors, and status indicators.
 *
 * @component
 * @param {CalendarShiftComponentProps} props - Component props
 * @param {number} [props.width] - Optional. Width of the shift block in pixels.
 * @param {number} [props.height] - Optional. Height of the shift block in pixels.
 * @param {ShiftType} props.shift - Required. Shift data including bookings and visual properties.
 * @param {number} props.rowHeight - Required. Height of a single row (time slot) in pixels.
 * @param {number} props.intervalPerHour - Required. Number of intervals per hour (e.g., 2 means 30-minute slots).
 *
 * @returns {JSX.Element} The CalendarShiftComponent.
 */
export function CalendarShiftComponent({
  shift,
  width,
  height,
  rowHeight,
  intervalPerHour,
}: CalendarShiftComponentProps) {
  const backgroundColor = convertHexToRGBA(shift.backgroundColor, 0.2);

  return (
    <div
      className="flex gap-0.5"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
      }}
    >
      {/* Shift Indicator Line */}
      <div
        className="w-2 rounded-t rounded-b"
        style={{
          backgroundColor: convertHexToRGBA(shift.backgroundColor, 0.4),
        }}
      />
      {/* Booking Block */}
      <div className="flex-1 relative">
        {/* With Booking Slots  */}
        {shift.bookings &&
          shift.bookings.length > 0 &&
          shift.bookings.map(booking => {
            const top = getTopOffset(
              booking.startTime,
              shift.startTime.getHours(),
              rowHeight,
              intervalPerHour
            );
            const height = getEventHeight(
              booking.startTime,
              booking.endTime,
              rowHeight,
              intervalPerHour
            );
            const fontColor = shiftColor({ hex: shift.backgroundColor, shiftLevel: 3 });
            const isPending = booking.status === 'PENDING';
            const isBooked =
              booking.status === 'BOOKED' ||
              booking.status === 'ARRIVED' ||
              booking.status === 'COMPLETE' ||
              isPending;
            const isAvailableBookingSlot = booking.status === 'AVAILABLE';
            return (
              <div
                key={`${shift.providerUserId}-${booking.startTime}-${booking.endTime}`}
                className={clsx('absolute rounded-sm border-1 border-transparent w-full')}
                style={{
                  top,
                  height,
                }}
              >
                {isBooked && (
                  <div
                    className={clsx(`font-inter text-[11px] font-semibold h-full pl-1`)}
                    style={{
                      backgroundColor: isPending
                        ? convertHexToRGBA(shift.backgroundColor, 0.1)
                        : backgroundColor,
                      color: isPending ? convertHexToRGBA(fontColor, 0.5) : fontColor,
                      filter: 'saturate(130%)',
                      ...(isPending && {
                        backgroundImage,
                        backgroundRepeat: 'repeat',
                        backgroundSize: '32px 32px',
                      }),
                    }}
                  >
                    {booking.clientName}
                  </div>
                )}
                {isAvailableBookingSlot && (
                  <div
                    className="h-full pl-1 flex gap-1 pt-px"
                    style={{
                      backgroundColor: convertHexToRGBA(shift.backgroundColor, 0.1),
                      filter: 'saturate(130%)',
                    }}
                  >
                    {booking.bookingMethod?.includes('ONLINE') && (
                      <FrankSVGIcon width={14} height={14} viewBox="0 0 14 14">
                        <g mask="url(#mask0_2657_73125)">
                          <path
                            d="M6.37282 6.89004L5.44066 5.95787C5.3972 5.91451 5.3499 5.88199 5.29876 5.86031C5.24753 5.83863 5.19478 5.82779 5.14053 5.82779C5.08628 5.82779 5.03111 5.83863 4.97501 5.86031C4.91901 5.88199 4.86928 5.91451 4.82582 5.95787C4.74134 6.04236 4.6991 6.14483 4.6991 6.26529C4.6991 6.38565 4.74134 6.48808 4.82582 6.57256L6.00372 7.75381C6.10921 7.8593 6.23224 7.91204 6.37282 7.91204C6.51341 7.91204 6.63644 7.8593 6.74193 7.75381L9.3366 5.34202C9.3366 5.22759 9.32872 5.1152 9.31297 5.00485C9.29732 4.8946 9.24909 4.79908 9.1683 4.71829C9.07779 4.62778 8.97386 4.58252 8.85651 4.58252C8.73907 4.58252 8.63509 4.62778 8.54457 4.71829L6.37282 6.89004ZM0.807678 11.8013V10.9263H12.7546C12.8788 10.9263 12.9828 10.9682 13.0666 11.052C13.1503 11.1357 13.1921 11.2396 13.1921 11.3638C13.1921 11.4879 13.1503 11.5919 13.0666 11.6756C12.9828 11.7594 12.8788 11.8013 12.7546 11.8013H0.807678ZM2.51276 10.3429C2.21808 10.3429 1.96866 10.2409 1.76449 10.0367C1.56032 9.83252 1.45824 9.5831 1.45824 9.28842V3.23079C1.45824 2.93611 1.56032 2.68669 1.76449 2.48252C1.96866 2.27835 2.21808 2.17627 2.51276 2.17627H11.4871C11.7817 2.17627 12.0312 2.27835 12.2353 2.48252C12.4395 2.68669 12.5416 2.93611 12.5416 3.23079V9.28842C12.5416 9.5831 12.4395 9.83252 12.2353 10.0367C12.0312 10.2409 11.7817 10.3429 11.4871 10.3429H2.51276ZM2.51276 9.46794H11.4871C11.532 9.46794 11.5731 9.44927 11.6104 9.41194C11.6479 9.37451 11.6666 9.33333 11.6666 9.28842V3.23079C11.6666 3.18587 11.6479 3.14475 11.6104 3.10742C11.5731 3.06999 11.532 3.05127 11.4871 3.05127H2.51276C2.46785 3.05127 2.42672 3.06999 2.38939 3.10742C2.35196 3.14475 2.33324 3.18587 2.33324 3.23079V9.28842C2.33324 9.33333 2.35196 9.37451 2.38939 9.41194C2.42672 9.44927 2.46785 9.46794 2.51276 9.46794Z"
                            fill="#29845A"
                          />
                        </g>
                      </FrankSVGIcon>
                    )}
                    {booking.bookingMethod?.includes('PHONE') && (
                      <FrankSVGIcon width={14} height={14} viewBox="0 0 14 14">
                        <g mask="url(#mask0_2657_73128)">
                          <path
                            d="M11.34 11.9582C10.2408 11.9582 9.13636 11.7026 8.02686 11.1914C6.91745 10.6802 5.89813 9.95909 4.96888 9.02809C4.03973 8.09699 3.31955 7.07762 2.80836 5.96996C2.29716 4.86241 2.04156 3.75898 2.04156 2.65969C2.04156 2.48304 2.0999 2.33584 2.21656 2.21811C2.33323 2.10037 2.47907 2.0415 2.65407 2.0415H4.55661C4.7039 2.0415 4.83384 2.08958 4.94642 2.18573C5.059 2.28179 5.13061 2.4005 5.16123 2.54186L5.49563 4.25817C5.51877 4.41742 5.51391 4.55426 5.48104 4.66869C5.44809 4.78312 5.38898 4.87923 5.30371 4.957L3.9565 6.26848C4.17331 6.66554 4.42103 7.04116 4.69967 7.39534C4.97821 7.74942 5.27979 8.08761 5.60442 8.4099C5.92447 8.73005 6.26475 9.02736 6.62525 9.30182C6.98575 9.57628 7.37503 9.83168 7.79309 10.068L9.10209 8.74765C9.19338 8.65266 9.30392 8.58607 9.43371 8.54786C9.56341 8.50975 9.6982 8.50041 9.83811 8.51986L11.4579 8.84973C11.6052 8.88862 11.7254 8.96378 11.8185 9.07519C11.9117 9.18661 11.9582 9.313 11.9582 9.45436V11.3457C11.9582 11.5207 11.8994 11.6665 11.7816 11.7832C11.6639 11.8998 11.5167 11.9582 11.34 11.9582ZM3.54248 5.44059L4.58359 4.4444C4.60225 4.42943 4.61441 4.40886 4.62004 4.38271C4.62568 4.35656 4.62476 4.33225 4.61727 4.3098L4.36367 3.00619C4.35618 2.97634 4.34311 2.95393 4.32444 2.93896C4.30577 2.92399 4.28147 2.9165 4.25152 2.9165H3.00406C2.98161 2.9165 2.96289 2.92399 2.94792 2.93896C2.93304 2.95393 2.92561 2.97265 2.92561 2.99511C2.95545 3.39372 3.02069 3.79865 3.12131 4.2099C3.22184 4.62125 3.36223 5.03148 3.54248 5.44059ZM8.61748 10.4819C9.00413 10.6622 9.40741 10.8 9.82732 10.8953C10.2473 10.9906 10.6398 11.0472 11.0046 11.0652C11.0271 11.0652 11.0458 11.0577 11.0608 11.0428C11.0757 11.0278 11.0832 11.0091 11.0832 10.9866V9.75944C11.0832 9.7295 11.0757 9.70519 11.0608 9.68653C11.0458 9.66786 11.0234 9.65478 10.9935 9.6473L9.76854 9.39821C9.74609 9.39073 9.72645 9.3898 9.70963 9.39544C9.69281 9.40108 9.67502 9.41323 9.65625 9.4319L8.61748 10.4819Z"
                            fill="#4188FF"
                          />
                        </g>
                      </FrankSVGIcon>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        {/* No Booking Slot */}
        {shift.bookings && shift.bookings.length === 0 && (
          <div className="bg-[#00000008] rounded-sm h-full box-border bordder-[#E3E3E3] border-1 border-dashed p-1">
            <BiBlock color="#CCCCCC" size={16} />
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarShiftComponent;
