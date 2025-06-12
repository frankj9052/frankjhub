import { BookingType } from '../FrankBigCalendar';
import { useState } from 'react';
import { FrankAvatar } from '@frankjhub/shared-ui-hero-ssr';
import { format } from 'date-fns';
import ListDayBookingStatusChip from './ListDayBookingStatusChip';
import styles from './listDayBookingEvent.module.css';
import clsx from 'clsx';
import { PiWarningCircle } from 'react-icons/pi';
import { NoqButton } from '@frankjhub/shared-ui-hero-ssr';
import { FrankSVGIcon } from '@frankjhub/shared-ui-core';

export type BookingEventActionsType = {
  handleDeclineBooking: (bookingData: BookingType) => void;
  handleAproveBooking: (bookingData: BookingType) => void;
  handleClientArrived: (bookingData: BookingType) => void;
  handleClientNoShow: (bookingData: BookingType) => void;
};

export type ListDayBookingEventProps = {
  bookingData: BookingType;
  bookingEventActions?: BookingEventActionsType;
};

export function ListDayBookingEvent({
  bookingData,
  bookingEventActions,
}: ListDayBookingEventProps) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={clsx('w-full h-[40px] relative cursor-pointer hover:bg-[#F7F7F7]', {})}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pending Status Record */}
      {bookingData.status === 'PENDING' && (
        <div className={`absolute left-0 top-0 right-0 bottom-0 z-[2]`}>
          <div
            className={`${styles.bgGrid} absolute left-0 top-0 right-0 bottom-0 z-[-1] bg-[#fff] opacity-70`}
          />
          {/* Mask */}
          <div className="items-center absolute left-0 top-0 right-0 bottom-0 grid grid-cols-7">
            <div className="col-start-6 col-end-8 flex items-center gap-1">
              <PiWarningCircle size={24} className="text-[#EF4D2F]" />
              <span className="text-[#8E1F0B] text-[13px] font-inter">Pending appointment</span>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="items-center absolute left-0 top-0 right-0 bottom-0 grid grid-cols-7">
            {isHovered && (
              <div className="col-start-6 col-end-8 flex items-center justify-end gap-2 pr-4">
                <div>
                  <NoqButton
                    text="Decline"
                    theme="Default"
                    handleClick={() => {
                      if (bookingEventActions && bookingEventActions?.handleDeclineBooking) {
                        bookingEventActions.handleDeclineBooking(bookingData);
                      }
                    }}
                    width={71}
                    height={32}
                    textStyle="flex justify-center text-[13px] font-inter w-full"
                  />
                </div>
                <div>
                  <NoqButton
                    text="Approve"
                    theme="Brand"
                    handleClick={() => {
                      if (bookingEventActions && bookingEventActions?.handleAproveBooking) {
                        bookingEventActions.handleAproveBooking(bookingData);
                      }
                    }}
                    width={77}
                    height={32}
                    textStyle="text-[13px] font-inter flex justify-center w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="absolute left-0 top-0 right-0 bottom-0 z-[1] px-4 grid grid-cols-7">
        {/* Name */}
        <div className="h-full flex items-center">
          <div className="flex items-center gap-2 h-full">
            <FrankAvatar name={bookingData.clientName} src={bookingData.src} size="sm" />
            <p className="font-inter text-xs leading-4 text-text-base-primary">
              {bookingData.clientName}
            </p>
          </div>
        </div>
        {/* Start Time */}
        <div className="flex items-center">
          <div className="font-inter text-xs leading-4 text-text-base-secondary-60 font-normal">
            {format(bookingData.startTime, 'HH:mm')}
          </div>
        </div>
        {/* Booking Type */}
        <div className="flex items-center">
          <div className="font-inter text-xs leading-4 text-text-base-secondary-60 font-normal">
            {bookingData.serviceType ?? 'General Visit'}
          </div>
        </div>
        {/* Provider Name */}
        <div className="flex items-center">
          <div className="font-inter text-xs leading-4 text-text-base-secondary-60 font-normal">{`Dr ${bookingData.providerName}`}</div>
        </div>
        {/* Room */}
        <div className="flex items-center">
          <div className="font-inter text-xs leading-4 text-text-base-secondary-60 font-normal">{`${bookingData.room}`}</div>
        </div>
        {/* Status */}
        <div className="col-span-2 flex justify-end items-center h-full">
          {bookingData.status === 'BOOKED' && isHovered && (
            <div className="gap-2 flex items-center">
              <div>
                <NoqButton
                  text="No Show"
                  theme="Default"
                  handleClick={() => {
                    if (bookingEventActions && bookingEventActions?.handleClientNoShow) {
                      bookingEventActions.handleClientNoShow(bookingData);
                    }
                  }}
                  width={80}
                  height={32}
                  textStyle="flex justify-center text-[13px] font-inter w-full"
                />
              </div>
              <div>
                <NoqButton
                  icon={
                    <div className="ml-2">
                      <FrankSVGIcon viewBox="0 0 20 20" fill="none" width={20} height={20}>
                        <g mask="url(#mask0_2893_4806)">
                          <path
                            d="M8.81725 11.3463L6.88142 9.41021C6.766 9.29493 6.62093 9.2359 6.44621 9.23312C6.27163 9.23049 6.12392 9.28951 6.00308 9.41021C5.88239 9.53104 5.82204 9.67743 5.82204 9.84937C5.82204 10.0213 5.88239 10.1677 6.00308 10.2885L8.28996 12.5752C8.44065 12.7259 8.61642 12.8012 8.81725 12.8012C9.01809 12.8012 9.19385 12.7259 9.34454 12.5752L13.9808 7.93917C14.0961 7.82375 14.1551 7.67868 14.1579 7.50396C14.1605 7.32938 14.1015 7.18167 13.9808 7.06083C13.86 6.94014 13.7136 6.87979 13.5416 6.87979C13.3697 6.87979 13.2233 6.94014 13.1025 7.06083L8.81725 11.3463ZM4.42308 17.0833C4.00753 17.0833 3.65253 16.9362 3.35808 16.6419C3.06378 16.3474 2.91663 15.9924 2.91663 15.5769V4.42313C2.91663 4.00757 3.06378 3.65257 3.35808 3.35812C3.65253 3.06382 4.00753 2.91667 4.42308 2.91667H8.13142C8.18378 2.45403 8.38572 2.06062 8.73725 1.73646C9.08864 1.41215 9.50954 1.25 9.99996 1.25C10.4957 1.25 10.9193 1.41215 11.2708 1.73646C11.6223 2.06062 11.8216 2.45403 11.8685 2.91667H15.5768C15.9924 2.91667 16.3474 3.06382 16.6418 3.35812C16.9361 3.65257 17.0833 4.00757 17.0833 4.42313V15.5769C17.0833 15.9924 16.9361 16.3474 16.6418 16.6419C16.3474 16.9362 15.9924 17.0833 15.5768 17.0833H4.42308ZM4.42308 15.8333H15.5768C15.641 15.8333 15.6998 15.8066 15.7531 15.7531C15.8066 15.6998 15.8333 15.641 15.8333 15.5769V4.42313C15.8333 4.35896 15.8066 4.30021 15.7531 4.24687C15.6998 4.1934 15.641 4.16667 15.5768 4.16667H4.42308C4.35892 4.16667 4.30017 4.1934 4.24683 4.24687C4.19336 4.30021 4.16663 4.35896 4.16663 4.42313V15.5769C4.16663 15.641 4.19336 15.6998 4.24683 15.7531C4.30017 15.8066 4.35892 15.8333 4.42308 15.8333ZM9.99996 3.62187C10.1805 3.62187 10.3298 3.56285 10.4479 3.44479C10.5659 3.32674 10.625 3.17743 10.625 2.99687C10.625 2.81632 10.5659 2.66701 10.4479 2.54896C10.3298 2.4309 10.1805 2.37187 9.99996 2.37187C9.8194 2.37187 9.6701 2.4309 9.55204 2.54896C9.43399 2.66701 9.37496 2.81632 9.37496 2.99687C9.37496 3.17743 9.43399 3.32674 9.55204 3.44479C9.6701 3.56285 9.8194 3.62187 9.99996 3.62187Z"
                            fill="#E4FFE5"
                          />
                        </g>
                      </FrankSVGIcon>
                    </div>
                  }
                  text="Arrived"
                  theme="Brand"
                  handleClick={() => {
                    if (bookingEventActions && bookingEventActions?.handleClientArrived) {
                      bookingEventActions.handleClientArrived(bookingData);
                    }
                  }}
                  width={88}
                  height={32}
                  textStyle="text-[13px] font-inter"
                />
              </div>
            </div>
          )}
          <ListDayBookingStatusChip bookingStatus={bookingData.status} />
        </div>
      </div>
    </div>
  );
}
