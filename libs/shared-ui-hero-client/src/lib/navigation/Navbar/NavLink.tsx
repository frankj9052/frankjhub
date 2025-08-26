import { NavLinkType } from '@frankjhub/shared-utils';
import { NavbarItem } from '@heroui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * A navigation link component for use inside a navbar,
 * highlighting the link as active based on the current route.
 *
 * @param {string} text - The display text for the navigation link.
 * @param {string} href - The target URL path for the link.
 */
export const NavLink = ({ text, href }: NavLinkType) => {
  const pathname = usePathname();
  return (
    <NavbarItem
      isActive={pathname === href}
      as={Link}
      href={href}
      className="font-[500] hover:text-primary px-6 py-1"
    >
      {text}
    </NavbarItem>
  );
};
