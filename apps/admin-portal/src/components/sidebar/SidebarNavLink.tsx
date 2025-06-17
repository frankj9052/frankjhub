'use client';
import { NavLinkClient } from '@frankjhub/shared-ui-client';
import { usePathname } from 'next/navigation';

interface Props {
  text: string;
  href: string;
}

export const SidebarNavLink = ({ text, href }: Props) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return <NavLinkClient text={text} href={href} isActive={isActive} />;
};
