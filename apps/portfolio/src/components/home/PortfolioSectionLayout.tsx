'use client';

import { HeroTitle } from '@frankjhub/shared-ui-core';
import { FrankCarousel, FrankCarouselRefType, ProjectCard } from '@frankjhub/shared-ui-hero-client';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { GoDotFill } from 'react-icons/go';
import { GoDot } from 'react-icons/go';

interface ProjectDataItem {
  image: {
    width: number;
    height: number;
    alt: string;
    src: string;
  };
  title: string;
  subTitle: string;
  description: string;
  link: {
    label: string;
    href: string;
  };
}

const projectData: ProjectDataItem[] = [
  {
    image: {
      width: 640,
      height: 426,
      alt: 'noqclinic',
      src: '/images/project01.jpg',
    },
    title: 'NoQ Clinic',
    subTitle: 'AI-powered medical appointment platform',
    description: 'Website adaptable to all devices, with ui components and animated interactions',
    link: {
      label: 'Demo',
      href: 'https://noqclinic.com',
    },
  },
  {
    image: {
      width: 640,
      height: 426,
      alt: 'frankjhub',
      src: '/images/project02.jpg',
    },
    title: 'Frankjhub',
    subTitle: 'BaaS core with RBAC & multi-tenant architecture',
    description: 'Website adaptable to all devices, with ui components and animated interactions',
    link: {
      label: 'Demo',
      href: 'https://noqclinic.com',
    },
  },
  {
    image: {
      width: 640,
      height: 426,
      alt: 'dmsolving',
      src: '/images/project03.jpg',
    },
    title: 'DMSolving',
    subTitle: 'Implemented the official DMSolving website from UI/UX design',
    description: 'Website adaptable to all devices, with ui components and animated interactions',
    link: {
      label: 'Demo',
      href: 'https://dmsolving.com',
    },
  },
  {
    image: {
      width: 640,
      height: 426,
      alt: 'plush-up',
      src: '/images/project01.jpg',
    },
    title: 'Plush Up',
    subTitle: 'Built official VR game website with admin access control',
    description: 'Website adaptable to all devices, with ui components and animated interactions',
    link: {
      label: 'Demo',
      href: 'https://plush-up.com',
    },
  },
  {
    image: {
      width: 640,
      height: 426,
      alt: 'claclaws',
      src: '/images/project02.jpg',
    },
    title: 'Claclaws',
    subTitle: 'Implemented official arcade claw machine store website from design',
    description: 'Website adaptable to all devices, with ui components and animated interactions',
    link: {
      label: 'Demo',
      href: 'https://claclaws.com',
    },
  },
];

export const PortfolioSectionLayout = () => {
  const swiperRef = useRef<FrankCarouselRefType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [pageSize, setPageSize] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (swiperRef.current?.swiper) {
      setIsBeginning(swiperRef.current?.swiper?.isBeginning);
      setIsEnd(swiperRef.current?.swiper?.isEnd);
      setPageSize(swiperRef.current.swiper.slidesPerViewDynamic() - 1);
    }
  }, []);

  return (
    <div className="w-full h-full md:pt-8">
      {/* Title */}
      <div className="mb-8">
        <HeroTitle>Portfolio</HeroTitle>
      </div>
      {/* Swiper */}
      <div className="">
        <div className="flex justify-between items-center">
          <MdKeyboardArrowLeft
            size={100}
            className={clsx('', {
              'cursor-pointer text-primary': !isBeginning,
              'cursor-default text-gray-400': isBeginning,
            })}
            onClick={() => {
              swiperRef.current?.swiper?.slidePrev();
            }}
          />
          <div className="overflow-hidden select-none">
            <FrankCarousel
              ref={swiperRef}
              childWidth={300}
              spaceBetween={40}
              freeMode={true}
              slidesPerView={'auto'}
              onActiveIndexChange={index => {
                if (swiperRef.current?.swiper) {
                  setIsBeginning(swiperRef.current?.swiper?.isBeginning);
                  setIsEnd(swiperRef.current?.swiper?.isEnd);
                  // setPageSize(swiperRef.current.swiper.slidesPerViewDynamic() - 1);
                  setCurrentIndex(index);
                }
              }}
            >
              {projectData.map(item => (
                <ProjectCard
                  key={item.title}
                  image={{
                    height: item.image.height,
                    width: item.image.width,
                    alt: item.image.alt,
                    src: item.image.src,
                  }}
                  title={item.title}
                  subTitle={item.subTitle}
                />
              ))}
            </FrankCarousel>
          </div>
          <MdKeyboardArrowRight
            size={100}
            className={clsx('', {
              'cursor-pointer text-primary': !isEnd,
              'cursor-default text-gray-400': isEnd,
            })}
            onClick={() => {
              swiperRef.current?.swiper?.slideNext();
            }}
          />
        </div>
        <div className="flex justify-center mt-1">
          {Array.from({ length: projectData.length - pageSize + 1 }).map((_, index) => (
            <div key={`pagination-${index}`}>
              {currentIndex === index ? <GoDotFill /> : <GoDot />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
