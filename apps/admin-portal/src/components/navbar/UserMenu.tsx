'use client';
import { Session } from '@/libs/redux/slices/currentUserSlice/currentUserSlice';
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@heroui/react';
import Link from 'next/link';
import React from 'react';

type Props = {
  session: Session;
};

export default function UserMenu({ session }: Props) {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="secondary"
          // name={user?.userName || 'user avatar'}
          size="sm"
          // src={user?.image || '/images/user.png'}
        />
      </DropdownTrigger>
      <DropdownMenu variant="flat" aria-label="User actions menu">
        <DropdownSection showDivider>
          <DropdownItem
            isReadOnly
            as="span"
            className="h-14 flex flex-row"
            aria-label="username"
            key={'signIn Info'}
          >
            {/* Signed in as {user?.userName} */}
          </DropdownItem>
        </DropdownSection>

        <DropdownItem as={Link} href="/members/edit" key={'edit profile'}>
          Edit profile
        </DropdownItem>
        <DropdownItem
          color="danger"
          onPress={
            () => console.log('clicked')
            // async () => await signOutUser()
          }
          key={'logout'}
        >
          Log out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
