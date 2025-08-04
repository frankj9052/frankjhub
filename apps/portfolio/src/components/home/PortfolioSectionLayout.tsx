'use client';

import { HeroTitle } from '@frankjhub/shared-ui-core';
import { FrankCarousel } from '@frankjhub/shared-ui-hero-client';
import { ProjectCard } from './PortfolioSectionLayout/ProjectCard';

interface ProjectDataItem {
  image: {
    width: number;
    height: number;
    alt: string;
    src: string;
  };
  title: string;
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
      alt: 'Plush-up',
      src: '/images/project01.jpg',
    },
    title: 'Plush Up',
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
    description: 'Website adaptable to all devices, with ui components and animated interactions',
    link: {
      label: 'Demo',
      href: 'https://claclaws.com',
    },
  },
];

export const PortfolioSectionLayout = () => {
  return (
    <div className="w-full h-full md:pt-8">
      {/* Title */}
      <div>
        <HeroTitle>Portfolio</HeroTitle>
      </div>
      {/* Swiper */}
      <div>
        <FrankCarousel childWidth={300}>
          {projectData.map(item => (
            <ProjectCard key={item.title} />
          ))}
        </FrankCarousel>
      </div>
    </div>
  );
};
