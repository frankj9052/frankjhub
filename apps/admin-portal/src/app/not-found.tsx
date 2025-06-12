'use client';
import { Button } from '@heroui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <section className="w-full h-screen-minus-64 bg-[#051928] bg-opacity-60 flex justify-center items-center text-barlow">
      <div className="flex flex-col gap-8 items-center">
        <h4 className="font-bold text-4xl leading-[43.2px] text-white text-center">
          Page Not Found
        </h4>
        <h1 className="font-bold text-[86px] leading-[90px] text-center text-white">404</h1>
        <p className="text-[17px] leading-6 text-center text-white text-source opacity-80">
          Sorry, we couldn’t find the page you are looking for.
        </p>
        <div className="flex gap-8">
          <Button
            className="w-[170px] h-[49px] px-6 py-4 bg-[#FFC72C] font-bold text-[14px] leading-[16.8px] tracking-[1px] text-[#051928] relative overflow-hidden flex justify-center items-center"
            radius="full"
            onPress={() => {
              router.back();
            }}
          >
            GO BACK
          </Button>
          <Button
            className="w-[170px] h-[49px] px-6 py-4 bg-[#FFC72C] font-bold text-[14px] leading-[16.8px] tracking-[1px] text-[#051928] relative overflow-hidden flex justify-center items-center"
            radius="full"
            as={Link}
            href="/"
          >
            BACK TO HOME
          </Button>
        </div>
      </div>
    </section>
  );
}
