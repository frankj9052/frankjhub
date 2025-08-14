import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import { RiMapPin3Fill } from 'react-icons/ri';

export interface CustomLocationMarkerProps {
  highLight?: boolean;
  image?: string;
}

export const CustomLocationMarker = ({ highLight = false, image }: CustomLocationMarkerProps) => {
  return (
    <div>
      {/* location marker */}
      <div></div>

      {/* popup window */}
      <div
        className={clsx(
          'w-[12px] h-[12px] absolute rounded-full overflow-hidden -translate-y-[0.7px]',
          'opacity-0 scale-75 transition-all duration-200 ease-in-out',
          'group-data-[active=true]:opacity-100 group-data-[active=true]:scale-100'
        )}
      >
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
      <RiMapPin3Fill size={21} />
    </div>
  );
};
