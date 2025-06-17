'use client';
import { NavbarItem } from '@heroui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type Props = {
  href: string;
  label: string;
};

const unreadCount = 0;

export default function NavLink({ href, label }: Props) {
  const pathname = usePathname();
  const basepath = '/' + pathname.split('/')[1];
  return (
    <NavbarItem isActive={basepath === href} as={Link} href={href}>
      <span>{label}</span>
      {
        // 当message为0的时候，不显示0
        href === '/messages' && unreadCount > 0 && <span className="ml-1">({unreadCount})</span>
      }
    </NavbarItem>
  );
}
