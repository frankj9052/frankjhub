'use client';
import { FrankButtonBase, HeroTitle } from '@frankjia9052/shared-ui';
import { Divider } from '@heroui/react';
import Image from 'next/image';
import { NumberRiserComponent } from './AboutSectionLayout/NumberRiserComponent';
import { IoMdDownload } from 'react-icons/io';

const data = {
  avatar: {
    width: 625,
    height: 476,
    src: '/images/avatar-02.png',
    alt: 'avatar-02',
  },
  title: "I'm Frank",
  subtitle: (
    <div className="text-lg font-semibold">
      A <span className="text-primary">Full-Stack Developer</span> in{' '}
      <span className="text-primary">DMSolving</span>
    </div>
  ),
  description:
    'I do development services for customers specializing creating stylish, modern websites, web services and online stores. Passion in software development especially Front-End and Full-Stack development. Check out my Portfolio',
};

export const AboutSectionLayout = () => {
  return (
    <div className="text-color-text-black md:pt-8 h-full" id="about">
      {/* title */}
      <div>
        <HeroTitle>About Me</HeroTitle>
      </div>
      {/* content */}
      <div className="flex flex-col gap-3 md:flex-row md:mt-24 md:gap-8">
        {/* image */}
        <div className="md:flex-[0.5]">
          <div className="flex justify-center items-center md:h-full">
            <Image
              height={data.avatar.height}
              width={data.avatar.width}
              alt={data.avatar.alt}
              src={data.avatar.src}
              priority
              className="w-1/2 md:w-full"
            />
          </div>
        </div>
        {/* text */}
        <div className="flex flex-col gap-3 md:flex-[0.5] md:gap-10">
          {/* main text */}
          <div className="flex flex-col gap-1 md:gap-4">
            <h1 className="text-4xl font-semibold hidden md:block">{data.title}</h1>
            <h2 className="w-full">{data.subtitle}</h2>
            <p className="text-color-text-gray">{data.description}</p>
          </div>
          <Divider orientation="horizontal" />
          {/* number */}
          <div className="flex justify-between md:justify-start md:gap-6">
            <div className="">
              <NumberRiserComponent number={3} text="Years of Experience" />
            </div>
            <div>
              <NumberRiserComponent number={502} text="Happy Customers" />
            </div>
            <div>
              <NumberRiserComponent number={97} text="Completed Projects" />
            </div>
          </div>
          {/* download button */}
          <div className="flex justify-center items-center md:justify-start w-full">
            <FrankButtonBase
              variant="solid"
              color="primary"
              height={65}
              width={196}
              radius="sm"
              customizeContent={
                <div className="flex gap-1 font-[500]">
                  <span>Download CV</span>
                  <span>
                    <IoMdDownload size={16} />
                  </span>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
