import clsx from 'clsx';
import { BookingType } from '../FrankBigCalendar';
import { IoSearchOutline } from 'react-icons/io5';
import { BookingEventActionsType, ListDayBookingEvent } from './ListDayBookingEvent';
import { useMemo } from 'react';
import { usePagination } from '../../../../useHooks';
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';
import { NoqButton } from '../../../general';

export type ListDayProps = {
  bookingData?: BookingType[];
  bookingEventActions?: BookingEventActionsType;
};

/**
 * ListDay - Displays a paginated list of bookings for a specific day.
 * Shows each booking using the ListDayBookingEvent component and includes pagination controls.
 * If no data is provided, a "No results found" message is displayed.
 *
 * @component
 * @param {ListDayProps} props - Component props
 * @param {BookingType[]} [props.bookingData] - Optional. Array of bookings to be displayed.
 * @param {BookingEventActionsType} [props.bookingEventActions] - Optional. Event handler functions for booking actions (e.g. cancel, check-in).
 *
 * @returns {JSX.Element} The ListDay component.
 */
export function ListDay({ bookingData, bookingEventActions }: ListDayProps) {
  const noData: boolean = !bookingData || bookingData?.length === 0;
  const { currentPage, pageSize, isFirstPage, isLastPage, goToPreviousPage, goToNextPage } =
    usePagination({
      totalItems: bookingData?.length || 0,
      pageSize: 15,
    });
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return bookingData?.slice(start, end);
  }, [bookingData, currentPage, pageSize]);
  return (
    <div className="w-full h-full">
      {/* Data Display */}
      <div
        className={clsx('w-full h-full', {
          hidden: noData,
        })}
      >
        <div className="max-h-[calc(100%-44px)]">
          {!noData &&
            paginatedData?.map((item, index) => {
              return (
                <div className="border-b-1 border-[#EBEBEB]" key={`listDay-${index}`}>
                  <ListDayBookingEvent
                    bookingData={item}
                    bookingEventActions={bookingEventActions}
                  />
                </div>
              );
            })}
        </div>
        <div className="w-full h-[44px] absolute left-0 bottom-0 flex justify-between select-none items-center pl-4 text-[13px] font-inter text-[#303030]">
          <div>Total Record: {bookingData?.length || 0}</div>
          <div className="flex gap-2 items-center pr-4 font-[500]">
            <NoqButton
              theme="Default"
              width={96}
              height={32}
              icon={
                <div className="flex items-center gap-1 justify-center">
                  <IoIosArrowBack className="-translate-y-[0.3px]" size={13} />
                  <span>Previous</span>
                </div>
              }
              isDisabled={isFirstPage}
              handleClick={() => {
                goToPreviousPage();
              }}
            />
            <NoqButton
              theme="Default"
              width={72}
              height={32}
              icon={
                <div className="flex items-center gap-1 justify-center">
                  <span>Next</span>
                  <IoIosArrowForward className="-translate-y-[0.3px]" size={13} />
                </div>
              }
              isDisabled={isLastPage}
              handleClick={() => {
                goToNextPage();
              }}
            />
          </div>
        </div>
      </div>
      {/* Empty Display */}
      {noData && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-1">
            <div>
              <IoSearchOutline size={48} />
            </div>
            <div className="text-[#0F1324CC] font-inter text-xs ">No results found</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListDay;
