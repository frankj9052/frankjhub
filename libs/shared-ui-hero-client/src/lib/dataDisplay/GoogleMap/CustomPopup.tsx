import Image from 'next/image';
import Link from 'next/link';
import { FrankButtonBase } from '@frankjhub/shared-ui-hero-ssr';
import clsx from 'clsx';

export const POPUP_ROOT_SELECTOR = '[data-popup-root]';
export const POPUP_ROOT_ATTR = 'data-popup-root';
export const POPUP_SELECTED_ATTR = 'data-selected';

type CustomPopupProps = {
  address?: string;
  label?: string;
  image?: string;
  link?: string;
  /** 仅 Storybook 或需要本地受控时用；Map 内可不传，走 group+data-open */
  selected?: boolean;
};

export function CustomPopup({ address, label, image, link, selected }: CustomPopupProps) {
  return (
    <div
      {...{ [POPUP_ROOT_ATTR]: '' }}
      data-selected={selected === undefined ? undefined : selected ? 'true' : 'false'}
      className="group"
    >
      <div className="relative w-[200px] h-[130px] pointer-events-auto">
        <div
          className={clsx([
            'rounded-md shadow-large bg-white w-full h-full overflow-hidden',
            'opacity-0 translate-y-[6px]',
            'transition-[opacity,transform] duration-500 ease-out',
            'group-data-[selected=true]:opacity-100 group-data-[selected=true]:translate-y-0',
          ])}
        >
          <div className="h-[50px] w-full relative">
            <Image
              fill
              priority
              alt="clinic photo"
              src={
                image ??
                'https://res.cloudinary.com/dqluguvjq/image/upload/v1755200815/no-photo_yjgz9e.jpg'
              }
              className="object-cover w-full h-full"
            />
          </div>
          <div className="px-3 pt-2 h-full">
            <div className="font-semibold">{label ?? 'Location'}</div>
            {address ? <div className="text-xs text-gray-600">{address}</div> : null}
            <div className="mb-1" />
            <Link href={link ?? ''}>
              <FrankButtonBase
                width={36}
                height={24}
                radius="sm"
                variant="solid"
                color="primary"
                customizeContent={<div className="text-xs">Book</div>}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
