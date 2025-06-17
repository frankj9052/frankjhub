import clsx from 'clsx';
import Link from 'next/link';

export interface NavLinkClientProps {
  text: string;
  href: string;
  isActive?: boolean;
}

export const NavLinkClient = ({ text, href, isActive }: NavLinkClientProps) => {
  return (
    <Link
      className={clsx(
        'px-3 py-2 transition-colors duration-200 text-sm font-medium w-full ',
        'hover:underline hover:underline-offset-4',
        {
          'underline underline-offset-4 text-black': isActive,
          'text-gray-400': !isActive,
        }
      )}
      href={href}
    >
      {text}
    </Link>
  );
};
