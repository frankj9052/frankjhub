import clsx from 'clsx';
import Link from 'next/link';
import { ReactNode } from 'react';

export type SocialMediaLinksProps = {
  orientation?: 'horizontal' | 'vertical';
  reactIcons: {
    reactIcon: ReactNode;
    href: string;
  }[];
};

/**
 * A flexible component for displaying social media icons as links,
 * arranged either horizontally or vertically.
 *
 * @param {'horizontal' | 'vertical'} [orientation='horizontal'] - Optional. Layout orientation of the icons.
 * @param {{ reactIcon: ReactNode, href: string }[]} reactIcons - Array of social media icons and their corresponding link URLs.
 */
export const SocialMediaLinks = ({
  orientation = 'horizontal',
  reactIcons,
}: SocialMediaLinksProps) => {
  return (
    <div
      className={clsx({
        'w-full flex justify-between': orientation === 'horizontal',
        'h-full flex flex-col justify-between w-fit': orientation === 'vertical',
      })}
    >
      {reactIcons &&
        reactIcons.map((icon, index) => {
          return (
            <Link href={icon.href} key={`social-media-link-${index}`}>
              {icon.reactIcon}
            </Link>
          );
        })}
    </div>
  );
};

export default SocialMediaLinks;
