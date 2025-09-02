import clsx from 'clsx';
import Link from 'next/link';
import { MdArrowOutward } from 'react-icons/md';
import { FaStar } from 'react-icons/fa';
import { FrankTooltip } from '../../feedback/Tooltip/FrankTooltip';

export interface AddressCardProps {
  onPress?: () => void;
  selected?: boolean;
  hovered?: boolean;
  width?: number;
  address?: string;
  label?: string;
  link?: string;
  linkLabel?: string;
  linkTooltips?: string;
  rating?: number;
  userRatingsTotal?: number;
}

export const AddressCard = ({
  onPress,
  width,
  address,
  label,
  link,
  selected,
  hovered,
  rating = 0,
  userRatingsTotal = 0,
  linkLabel,
}: AddressCardProps) => {
  return (
    <div
      className={clsx(
        'h-[105px] p-4 flex flex-items items-center cursor-pointer rounded-lg outline outline-[#E3E3E3] outline-1 overflow-hidden',
        {
          'outline-primary': !!selected || !!hovered,
        }
      )}
      style={{
        width: width ? `${width}px` : '100%',
      }}
      onClick={onPress}
    >
      <div className="w-full h-full flex justify-between gap-4">
        {/* content */}
        <div className="w-full flex flex-col gap-3 justify-between text-[#303030]">
          {/* header */}
          <div className="h-full flex flex-col gap-1 justify-between">
            <h1 className="font-semibold text-[18px] leading-none">{label}</h1>
            <div className="flex items-center gap-1">
              <FaStar className="text-[#F3A504]" />
              <div className="text-[13px] flex items-center gap-[1.5px]">
                <span>{rating}</span>
                <span>({userRatingsTotal})</span>
              </div>
            </div>
          </div>
          {/* address */}
          <div className="text-[13px]">
            <div>{address}</div>
          </div>
        </div>
        {/* Link */}
        <FrankTooltip content={linkLabel}>
          <Link href={link ?? ''} target="_black" rel="noopener noreferrer">
            <MdArrowOutward size={24} className="text-[#4A4A4A]" />
          </Link>
        </FrankTooltip>
      </div>
    </div>
  );
};
