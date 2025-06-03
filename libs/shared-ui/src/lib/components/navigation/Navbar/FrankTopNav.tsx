import { NavLinkType } from '@frankjhub/shared-utils';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/react';
import { ReactNode, useState } from 'react';
import { NavLink } from './NavLink';

export type FrankTopNavProps = {
  navbarBrand?: ReactNode;
  navLinks?: NavLinkType[];
  navContentEnd?: ReactNode;
};

/**
 * A responsive top navigation bar component using @heroui/react,
 * featuring a brand section, navigation links, and optional end content.
 *
 * @param {ReactNode} [navbarBrand] - Optional. Content for the brand/logo area on the left.
 * @param {NavLinkType[]} [navLinks] - Optional. Array of navigation links with text and href.
 * @param {ReactNode} [navContentEnd] - Optional. Content to display on the right side of the navbar (e.g., buttons, icons).
 */
export const FrankTopNav = ({ navbarBrand, navLinks, navContentEnd }: FrankTopNavProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <Navbar
      maxWidth="xl"
      className="h-[80px] abg-[#fefefe] shadow-md"
      classNames={{
        item: ['data-[active=true]:text-primary'],
      }}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="md:hidden"
        />
        <NavbarBrand>{navbarBrand && navbarBrand}</NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="center" className="gap-10 hidden md:flex">
        {navLinks &&
          navLinks.map((link, index) => (
            <NavLink key={`${link.text}-${index}`} text={link.text} href={link.href} />
          ))}
      </NavbarContent>
      <NavbarContent justify="end">{navContentEnd && navContentEnd}</NavbarContent>
      <NavbarMenu className="pt-7">
        {navLinks &&
          navLinks.map((item, index) => (
            <NavbarMenuItem key={`${item.text}-${index}`}>
              <NavLink text={item.text} href={item.href} />
            </NavbarMenuItem>
          ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default FrankTopNav;
