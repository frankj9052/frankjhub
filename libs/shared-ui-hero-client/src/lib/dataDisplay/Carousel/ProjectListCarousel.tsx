import { useEffect, useRef, useState } from 'react';
import { ProjectCard } from '../Card/ProjectCard';
import { CarouselNavigation } from './CarouselNavigation';
import FrankCarousel, { FrankCarouselRefType } from './FrankCarousel';
import { CarouselPagination } from './CarouselPagination';
import { useConfirmModal } from '@frankjhub/shared-hooks';
import { FrankModal } from '../../feedback/Modal/FrankModal';
import Image from 'next/image';
import { FrankButtonBase } from '@frankjhub/shared-ui-hero-ssr';
import Link from 'next/link';

export interface ProjectData {
  title: string;
  subTitle: string;
  description: string;
  techStack: string[];
  link: {
    label: string;
    href: string;
  };
  image: {
    width: number;
    height: number;
    alt: string;
    src: string;
  };
}

export interface ProjectListCarouselProps {
  projects: ProjectData[];
  width?: number;
}

/**
 * ProjectListCarousel - A responsive carousel for showcasing a list of project cards.
 *
 * Includes navigation arrows, pagination dots, and a modal that displays project details
 * when a card is clicked. Uses a custom `FrankCarousel` component internally for slide behavior.
 *
 * @param {Object} props - Component props
 * @param {ProjectData[]} props.projects - List of project objects to render as cards
 * @param {number} [props.width] - Optional fixed width of the carousel container (in pixels)
 *
 * @returns {JSX.Element} A carousel UI displaying project cards with navigation and modal preview
 */
export const ProjectListCarousel = ({ projects, width }: ProjectListCarouselProps) => {
  const swiperRef = useRef<FrankCarouselRefType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [pageSize, setPageSize] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isOpen, config, openModal, closeModal } = useConfirmModal<ProjectData>();

  useEffect(() => {
    if (swiperRef.current?.swiper) {
      setIsBeginning(swiperRef.current?.swiper?.isBeginning);
      setIsEnd(swiperRef.current?.swiper?.isEnd);
      setPageSize(swiperRef.current.swiper.slidesPerViewDynamic() - 1);
    }
  }, []);

  return (
    <div
      style={{
        width: width ? `${width}px` : '100%',
      }}
    >
      <div className="flex justify-between items-center gap-3">
        <CarouselNavigation
          direction="left"
          disabled={isBeginning}
          onClick={() => {
            swiperRef.current?.swiper?.slidePrev();
          }}
        />
        <div className="overflow-hidden select-none">
          <FrankCarousel
            ref={swiperRef}
            childWidth={300}
            spaceBetween={40}
            slidesPerView={'auto'}
            onActiveIndexChange={index => {
              if (swiperRef.current?.swiper) {
                setIsBeginning(swiperRef.current?.swiper?.isBeginning);
                setIsEnd(swiperRef.current?.swiper?.isEnd);
                setCurrentIndex(index);
              }
            }}
          >
            {projects.map(project => (
              <ProjectCard
                key={project.title}
                image={{
                  height: project.image.height,
                  width: project.image.width,
                  alt: project.image.alt,
                  src: project.image.src,
                }}
                title={project.title}
                subTitle={project.subTitle}
                onPress={() => {
                  openModal(project);
                }}
              />
            ))}
          </FrankCarousel>
        </div>
        <CarouselNavigation
          direction="right"
          disabled={isEnd}
          onClick={() => {
            swiperRef.current?.swiper?.slideNext();
          }}
        />
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-1">
        <CarouselPagination
          size={projects.length - pageSize}
          currentIndex={currentIndex}
          onClick={index => {
            swiperRef.current?.swiper?.slideTo(index);
          }}
        />
      </div>
      {/* Modal */}
      <FrankModal
        isOpen={isOpen}
        onClose={closeModal}
        backdrop="opaque"
        draggable={true}
        size="4xl"
        header={config?.title}
        body={
          <div>
            <div className="flex justify-between gap-8 relative">
              <div className="lg:flex-[0.5]">
                <div>
                  {/* description */}
                  <h1 className="font-semibold mb-1">Description:</h1>
                  <p>{config?.description}</p>
                </div>
                {/* tech stack */}
                <div className="mt-4">
                  <h1 className="font-semibold mb-1">Tech Stack:</h1>
                  <ul className="ml-4 grid grid-cols-2">
                    {config?.techStack &&
                      config.techStack.map((item, index) => (
                        <li key={`tech-stack-${index}`} className="list-disc">
                          {item}
                        </li>
                      ))}
                  </ul>
                </div>

                {/* link */}
                <div className="lg:absolute lg:left-0 lg:bottom-0">
                  <FrankButtonBase
                    width={72}
                    height={36}
                    radius="sm"
                    color="primary"
                    customizeContent={<Link href={config?.link.href ?? ''}>Visit</Link>}
                  />
                </div>
              </div>
              {/* Image */}
              <div className="flex-[0.5] lg:block hidden">
                <Image
                  width={config?.image.width}
                  height={config?.image.height}
                  alt={config?.image.alt ?? 'error'}
                  src={config?.image.src ?? ''}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};
