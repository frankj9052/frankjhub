import Link from 'next/link';
import React from 'react';
import { GrUserAdmin } from 'react-icons/gr';
import { Navbar, NavbarBrand, NavbarContent } from '@heroui/react';
import NavLink from './NavLinks';
import AccountMenu from './AccountMenu';

export default async function TopNav() {
  return (
    <Navbar
      maxWidth="xl"
      className="bg-gradient-to-r from-purple-400 to-purple-700"
      classNames={{
        item: ['text-xl', 'text-white', 'text-uppercase', 'data-[active=true]:text-yellow-200'],
      }}
    >
      <NavbarBrand as={Link} href="/">
        <GrUserAdmin size={40} />
        <div className="font-bold text-3xl flex">
          <span className="text-gray-900">Admin</span>
          <span className="text-gray-200">Portal</span>
        </div>
      </NavbarBrand>
      <NavbarContent justify="center" className="text-gray-200">
        <NavLink href="/dashboard" label="Dashboard" />
      </NavbarContent>
      <NavbarContent justify="end">
        <AccountMenu />
      </NavbarContent>
    </Navbar>
  );
}
