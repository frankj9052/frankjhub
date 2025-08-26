'use client';
import { FrankButtonBase } from '@frankjhub/shared-ui-hero-ssr';
import { Spacer } from '@heroui/react';
import Link from 'next/link';
import { FaArrowAltCircleRight } from 'react-icons/fa';

const data = {
  title: "Hi, I'm Frank",
  subTitle: 'Full-stack Developer',
  description:
    'I create nice web applications for your business, good at both client and server software development.',
};

export const Info = () => {
  return (
    <div className="flex-[0.5] flex flex-col md:gap-5">
      <h2 className="md:text-6xl text-4xl font-semibold leading-[70px]">{data.title}</h2>
      <h3 className="text-color-text-gray md:text-xl text-lg font-semibold leading-[50px]">
        {data.subTitle}
      </h3>
      <p className="text-color-text-gray md:max-w-[350px]">{data.description}</p>
      {/* <Spacer y={10} className="hidden md:block"/> */}
      <Spacer y={5} className="md:hidden" />
      <div className="w-[196px] h-[65px]">
        <FrankButtonBase
          variant="solid"
          color="primary"
          customizeContent={<ButtonContent />}
          radius="sm"
        />
      </div>
    </div>
  );
};

function ButtonContent() {
  return (
    <Link href={'/contact'}>
      <div className="flex text-white items-center justify-center gap-2">
        <span>Contact Me</span>
        <span>
          <FaArrowAltCircleRight />
        </span>
      </div>
    </Link>
  );
}
