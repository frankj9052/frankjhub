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
      href: 'https://server.frankjhub.com/api-docs',
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
      alt: 'AddressList Map View – Google Maps Integration',
      src: '/images/address-list-map-view.png',
    },
    title: 'AddressList Map View',
    subTitle: 'React + Google Maps with Advanced Markers & React-driven Popups',
    description:
      'A production-grade Google Maps integration that geocodes address lists, renders AdvancedMarkerElement markers with React content, and drives animated popups via a custom OverlayView + React root. Hover/selection is handled by lightweight data-attrs without rebuilding the map, with viewport-aware panning, fitBounds, and robust cleanup.',
    link: {
      label: 'Visit',
      href: 'https://storybook.frankjhub.com/?path=/story/shared-ui-hero-client-datadisplay-googlemap-addresslistmapview--default',
    },
    techStack: [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Google Maps JavaScript API (Maps/Marker/Places/Geocoding)',
      '@googlemaps/js-api-loader',
      'AdvancedMarkerElement',
      'Custom Overlay (OverlayView)',
      'React Portals / createRoot',
      'requestAnimationFrame Animations',
      'LatLngBounds / fitBounds',
      'CollisionBehavior',
    ],
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
      width: 600,
      height: 678,
      alt: 'Noqclinic – Doctor Scheduling Calendar Component',
      src: '/images/noqclinic-calendar.png',
    },
    title: 'Doctor Scheduling Calendar',
    subTitle: 'Multi-view calendar for shifts & bookings',
    description:
      'A production-grade calendar for clinic scheduling that supports week grid, day grid, and list views. It renders provider shifts and patient bookings, with built-in navigation (Today/prev/next), controlled/uncontrolled state via a custom hook, and drag-and-drop interactions. Powered by date-fns for fast date math and designed as composable subcomponents (TimeGridWeek / TimeGridDay / ListDay) for easy reuse.',
    link: {
      label: 'Visit',
      href: 'https://storybook.frankjhub.com/?path=/story/shared-ui-hero-client-datadisplay-calendar-frankbigcalendar--default',
    },
    techStack: [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'date-fns',
      'react-dnd',
      'react-dnd-html5-backend',
      '@heroui/react',
      'clsx',
      'Composable Views: TimeGridWeek / TimeGridDay / ListDay',
      'Storybook',
    ],
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
