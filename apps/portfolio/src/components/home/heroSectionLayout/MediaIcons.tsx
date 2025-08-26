'use client';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SocialMediaLinks } from '@frankjhub/shared-ui-core';
import { SiStorybook } from 'react-icons/si';

const reactIcons = [
  {
    reactIcon: <FaGithub className="text-primary" size={24} />,
    href: 'https://github.com/frankj9052',
  },
  {
    reactIcon: <FaLinkedin className="text-primary" size={24} />,
    href: 'https://www.linkedin.com/in/frank-jia',
  },
  {
    reactIcon: <SiStorybook className="text-primary" size={24} />,
    href: 'http://ec2-98-81-80-209.compute-1.amazonaws.com/shared-ui',
  },
];

export const MediaIcons = () => {
  return (
    <div className="h-[130px]">
      <SocialMediaLinks orientation="vertical" reactIcons={reactIcons} />
    </div>
  );
};
