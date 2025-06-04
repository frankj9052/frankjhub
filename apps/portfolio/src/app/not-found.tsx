'use client';
import { FrankButtonBase } from '@frankjia9052/shared-ui';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <section className="absolute left-0 top-0 bottom-0 right-0 z-10 bg-[#051928] bg-opacity-60 flex justify-center items-center text-barlow">
      <div className="flex flex-col gap-8 items-center">
        <h4 className="font-bold text-4xl leading-[43.2px] text-white text-center">
          Page Not Found
        </h4>
        <h1 className="font-bold text-[86px] leading-[90px] text-center text-white">404</h1>
        <p className="text-[17px] leading-6 text-center text-white text-source opacity-80">
          Sorry, we couldn’t find the page you are looking for.
        </p>
        <div className="flex gap-8">
          <FrankButtonBase
            onPress={() => {
              router.back();
            }}
            radius="full"
            customizeContent={
              <div className="w-[170px] h-[49px] px-6 py-4 bg-primary font-bold text-[14px] leading-[16.8px] tracking-[1px] text-[#051928] relative overflow-hidden flex justify-center items-center">
                GO BACK
              </div>
            }
          />
          <FrankButtonBase
            onPress={() => {
              router.push('/');
            }}
            radius="full"
            customizeContent={
              <div className="w-[170px] h-[49px] px-6 py-4 bg-primary font-bold text-[14px] leading-[16.8px] tracking-[1px] text-[#051928] relative overflow-hidden flex justify-center items-center">
                BACK TO HOME
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}
