import Image from 'next/image';
import Link from 'next/link';
import { FrankButtonBase } from '@frankjhub/shared-ui-hero-ssr';
import clsx from 'clsx';
import { FaStar } from 'react-icons/fa';

export const POPUP_ROOT_SELECTOR = '[data-popup-root]';
export const POPUP_ROOT_ATTR = 'data-popup-root';
export const POPUP_SELECTED_ATTR = 'data-selected';

type CustomPopupProps = {
  address?: string;
  label?: string;
  image?: string;
  link?: string;
  width?: number;
  height?: number;
  selected?: boolean;
  rating?: number;
  userRatingsTotal?: number;
  linkLabel?: string;
};

export function CustomPopup({
  address,
  label,
  image,
  link,
  selected,
  width,
  height,
  rating,
  userRatingsTotal,
  linkLabel,
}: CustomPopupProps) {
  return (
    <div
      {...{ [POPUP_ROOT_ATTR]: '' }}
      data-selected={selected === undefined ? undefined : selected ? 'true' : 'false'}
      className="group"
    >
      <div
        className="relative pointer-events-auto"
        style={{
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : '100%',
        }}
      >
        <div
          className={clsx([
            'rounded-md shadow-large bg-white w-full h-full overflow-hidden flex flex-col',
            'opacity-0 translate-y-[6px]',
            'transition-[opacity,transform] duration-500 ease-out',
            'group-data-[selected=true]:opacity-100 group-data-[selected=true]:translate-y-0',
          ])}
        >
          <div className="w-full h-1/2 relative flex-1">
            <Image
              width={400}
              height={267}
              alt="clinic photo"
              src={
                image ??
                'https://res.cloudinary.com/dqluguvjq/image/upload/c_crop,w_400,h_267/v1755200815/no-photo_yjgz9e.jpg'
              }
              className="object-cover w-full h-full"
            />
          </div>
          <div className="px-6 pb-6 pt-3 h-full overflow-hidden flex flex-col justify-between gap-3 text-[#303030]">
            {/* Header */}
            <div>
              <h1 className="font-semibold text-[18px] leading-[18px] mb-1">
                {label ?? 'Location'}
              </h1>
              <div className="flex items-center gap-1">
                <FaStar className="text-[#F3A504]" />
                <div className="text-[13px] flex items-center gap-[1.5px]">
                  <span>{rating}</span>
                  <span>({userRatingsTotal})</span>
                </div>
              </div>
            </div>
            {/* Address */}
            <div>
              {address ? <div className="text-[13px] leading-[13px]">{address}</div> : null}
            </div>
            {/* Link */}
            {/* <Link href={link ?? ''} className='w-full bg-red-200'> */}
            <FrankButtonBase
              height={36}
              radius="sm"
              variant="solid"
              color="primary"
              fullWidth
              customizeContent={
                <Link
                  href={link ?? ''}
                  className="h-[36px] w-full flex items-center justify-center font-[550] text-[14px] text-[#E4FFE5]"
                >
                  {linkLabel}
                </Link>
              }
            />
            {/* </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
