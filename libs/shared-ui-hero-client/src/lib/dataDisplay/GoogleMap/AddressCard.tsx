import clsx from 'clsx';
import { hover } from 'framer-motion';
import Link from 'next/link';

export interface AddressCardProps {
  onPress?: () => void;
  selected?: boolean;
  hovered?: boolean;
  width?: number;
  address?: string;
  label?: string;
  image?: string;
  link?: string;
}

export const AddressCard = ({
  onPress,
  width,
  address,
  label,
  link,
  selected,
  hovered,
}: AddressCardProps) => {
  return (
    <div
      className={clsx('h-[95px] p-4 flex flex-items items-center cursor-pointer', {
        'bg-primary text-white': !!selected,
        'outline outline-1 outline-black': !!hovered,
      })}
      style={{
        width: width ? `${width}px` : '100%',
      }}
      onClick={onPress}
    >
      <div className="w-full">
        <h1 className="font-semibold text-[16px]">{label}</h1>
        <div className="flex justify-between text-xs">
          <div>{address}</div>
          <div
            className={clsx('underline font-bold text-gray-400', {
              'text-white': selected,
            })}
          >
            <Link href={link ?? ''}>Visit</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
