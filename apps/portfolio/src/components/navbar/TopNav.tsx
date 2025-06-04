'use client';
import { NavLinkType } from '@frankjia9052/shared-utils';
import { FrankTopNav } from '@frankjia9052/shared-ui';
import { TextBrand } from './TextBrand';

const publicLinks: NavLinkType[] = [
  { href: '/', text: 'Home' },
  { href: '/about', text: 'About' },
  { href: '/skill', text: 'Skill' },
  { href: '/portfolio', text: 'Portfolio' },
  { href: '/contact', text: 'Contact' },
];

export const TopNav = () => {
  return <FrankTopNav navbarBrand={<TextBrand />} navLinks={publicLinks} />;
};
