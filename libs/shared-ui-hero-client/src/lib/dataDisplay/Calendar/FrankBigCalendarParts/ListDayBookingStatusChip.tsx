import { ReactNode } from 'react';
import { BookingStatus } from '../FrankBigCalendar';

const CheckedIcon = () => {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M5.9999 11.8337C2.77815 11.8337 0.166565 9.22208 0.166565 6.00033C0.166565 2.77858 2.77815 0.166992 5.9999 0.166992C9.22165 0.166992 11.8332 2.77858 11.8332 6.00033C11.8332 9.22208 9.22165 11.8337 5.9999 11.8337ZM5.9999 10.667C7.23758 10.667 8.42456 10.1753 9.29973 9.30016C10.1749 8.42499 10.6666 7.238 10.6666 6.00033C10.6666 4.76265 10.1749 3.57566 9.29973 2.70049C8.42456 1.82532 7.23758 1.33366 5.9999 1.33366C4.76222 1.33366 3.57524 1.82532 2.70007 2.70049C1.8249 3.57566 1.33323 4.76265 1.33323 6.00033C1.33323 7.238 1.8249 8.42499 2.70007 9.30016C3.57524 10.1753 4.76222 10.667 5.9999 10.667ZM5.41831 8.33366L2.94323 5.85858L3.76806 5.03374L5.41831 6.68399L8.71765 3.38408L9.54306 4.20891L5.41831 8.33366Z"
        fill="#166E3F"
      />
    </svg>
  );
};
const CrossIcon = () => {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.9999 11.8337C2.77815 11.8337 0.166565 9.22208 0.166565 6.00033C0.166565 2.77858 2.77815 0.166992 5.9999 0.166992C9.22165 0.166992 11.8332 2.77858 11.8332 6.00033C11.8332 9.22208 9.22165 11.8337 5.9999 11.8337ZM5.9999 10.667C7.23758 10.667 8.42456 10.1753 9.29973 9.30016C10.1749 8.42499 10.6666 7.238 10.6666 6.00033C10.6666 4.76265 10.1749 3.57566 9.29973 2.70049C8.42456 1.82532 7.23758 1.33366 5.9999 1.33366C4.76222 1.33366 3.57524 1.82532 2.70007 2.70049C1.8249 3.57566 1.33323 4.76265 1.33323 6.00033C1.33323 7.238 1.8249 8.42499 2.70007 9.30016C3.57524 10.1753 4.76222 10.667 5.9999 10.667ZM5.9999 5.17549L7.64956 3.52524L8.47498 4.35066L6.82473 6.00033L8.47498 7.64999L7.64956 8.47541L5.9999 6.82516L4.35023 8.47541L3.52481 7.64999L5.17507 6.00033L3.52481 4.35066L4.35023 3.52524L5.9999 5.17549Z"
        fill="#9A1C13"
      />
    </svg>
  );
};

export function ListDayBookingStatusChip({ bookingStatus }: { bookingStatus: BookingStatus }) {
  let bgColor: string;
  let textColor: string;
  let icon: ReactNode;
  let text: string;
  switch (bookingStatus) {
    case 'COMPLETE':
      bgColor = 'bg-[#D1FAE4]';
      textColor = 'text-[#166E3F]';
      icon = <CheckedIcon />;
      text = 'Completed';
      break;
    case 'MISS':
      bgColor = 'bg-[#FCE5E4]';
      textColor = 'text-[#9A1C13]';
      icon = <CrossIcon />;
      text = 'No Show';
      break;
    case 'ARRIVED':
      bgColor = 'bg-[#D1FAE4]';
      textColor = 'text-[#166E3F]';
      icon = <CheckedIcon />;
      text = 'Arrived';
      break;
    default:
      bgColor = 'bg-transparent';
      textColor = 'hidden';
      icon = <div></div>;
      text = ' ';
      break;
  }
  return (
    <div
      className={`rounded-full flex justify-center items-center px-[9px] py-[6px] ${bgColor} ${textColor} font-medium text-[12px] space-x-1 h-[24px]`}
    >
      {icon}
      <p>{text}</p>
    </div>
  );
}

export default ListDayBookingStatusChip;
