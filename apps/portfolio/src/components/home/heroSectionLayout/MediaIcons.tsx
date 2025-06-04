'use client';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SocialMediaLinks } from '@frankjhub/shared-ui';
import { SiStorybook } from 'react-icons/si';

const reactIcons = [
  {
    reactIcon: <FaGithub className="text-primary" size={24} />,
    href: '#',
  },
  {
    reactIcon: <FaLinkedin className="text-primary" size={24} />,
    href: '#',
  },
  {
    reactIcon: <SiStorybook className="text-primary" size={24} />,
    href: '#',
  },
];

export const MediaIcons = () => {
  return (
    <div className="h-[130px]">
      <SocialMediaLinks orientation="vertical" reactIcons={reactIcons} />
    </div>
  );
};
