'use client';

import { HeroTitle } from '@frankjhub/shared-ui-core';
import { ProjectData, ProjectListCarousel } from '@frankjhub/shared-ui-hero-client';

const projectData: ProjectData[] = [
  {
    image: {
      width: 600,
      height: 678,
      alt: 'noqclinic',
      src: '/images/noqclinic.png',
    },
    title: 'NoQ Clinic',
    subTitle: 'AI-powered medical appointment platform',
    description:
      'A comprehensive AI-driven medical appointment platform supporting patient registration, doctor booking, and real-time communication. Features responsive design, dynamic UI components, and seamless integration with payment and authentication systems.',
    link: {
      label: 'Visit',
      href: 'https://noqclinic.com',
    },
    techStack: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'PostgreSQL',
      'redux',
      'stripe',
      'Prisma',
      'Pusher',
      'next-auth',
      'zod',
      'amplitude',
    ],
  },
  {
    image: {
      width: 600,
      height: 678,
      alt: 'frankjhub',
      src: '/images/frankjhub.png',
    },
    title: 'Frankjhub',
    subTitle: 'BaaS core with RBAC & multi-tenant architecture',
    description:
      'An enterprise-grade backend-as-a-service platform featuring role-based access control, multi-tenant support, and modular architecture. Built for scalability, maintainability, and high security, with comprehensive documentation pipelines.',
    link: {
      label: 'Visit',
      href: 'https://noqclinic.com',
    },
    techStack: [
      'Node.js',
      'TypeScript',
      'Express',
      'TypeORM',
      'PostgreSQL',
      'Redis',
      'Nx Monorepo',
      'zod',
      'storybook',
      'jest',
      'unit-test',
      'swagger',
      'argon2',
      'jose',
      'rollup',
      'winston',
      'RBAC',
    ],
  },
  {
    image: {
      width: 600,
      height: 678,
      alt: 'dmsolving',
      src: '/images/dmsolving.png',
    },
    title: 'DMSolving',
    subTitle: 'Implemented the official DMSolving website from UI/UX design',
    description:
      'A modern corporate website developed from UI/UX design to deployment. Fully responsive across devices, featuring smooth animations, optimized performance, and a clean visual identity aligned with brand guidelines.',
    link: {
      label: 'Visit',
      href: 'https://dmsolving.com',
    },
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
  },
  {
    image: {
      width: 1095,
      height: 501,
      alt: 'plush-up',
      src: '/images/plush-up.png',
    },
    title: 'Plush Up',
    subTitle: 'Built official VR game website with admin access control',
    description:
      'Official website for a VR claw machine game, featuring secure admin access control, engaging visual effects, and interactive animations to enhance user engagement. Optimized for speed and cross-device compatibility.',
    link: {
      label: 'Visit',
      href: 'https://plush-up.com',
    },
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
  },
  {
    image: {
      width: 1094,
      height: 501,
      alt: 'claclaws',
      src: '/images/claclaws.png',
    },
    title: 'Claclaws',
    subTitle: 'Implemented official arcade claw machine store website from design',
    description:
      'E-commerce website for an arcade claw machine store, developed from design to launch. Includes responsive layout, intuitive navigation, and an engaging product showcase optimized for conversions.',
    link: {
      label: 'Visit',
      href: 'https://claclaws.com',
    },
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
  },
];

export const PortfolioSectionLayout = () => {
  return (
    <div className="w-full h-full md:pt-8 pb-8">
      {/* Title */}
      <div className="md:mb-32 mb-16">
        <HeroTitle>Portfolio</HeroTitle>
      </div>
      {/* Swiper */}
      <ProjectListCarousel projects={projectData} />
    </div>
  );
};
