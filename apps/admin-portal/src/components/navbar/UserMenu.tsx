'use client';
import { currentUserSlice, useDispatch, useSelector } from '@/libs/redux';
import { getUserProfileAsync } from '@/libs/redux/slices/currentUserSlice/thunks';
import { logoutClient } from '@/services/auth';
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@heroui/react';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function UserMenu() {
  const dispatch = useDispatch();
  const userProfile = useSelector(state => state.currentUser.userProfile);
  useEffect(() => {
    console.log('user profile ===> ', userProfile);
  }, [userProfile]);
  useEffect(() => {
    dispatch(getUserProfileAsync());
  }, [dispatch]);
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="secondary"
          name={userProfile?.data?.userName || 'user avatar'}
          size="sm"
          src={userProfile?.data?.avatarImage || ''}
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
            Signed in as {userProfile?.data.userName}
          </DropdownItem>
        </DropdownSection>

        <DropdownItem as={Link} href="/members/edit" key={'edit profile'}>
          Edit profile
        </DropdownItem>
        <DropdownItem
          color="danger"
          onPress={async () => {
            await logoutClient();
            dispatch(currentUserSlice.actions.setSession(null));
            toast.success('You have been logged out.');
          }}
          key={'logout'}
        >
          Log out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
