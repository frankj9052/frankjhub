'use client';

import { useDispatch, useSelector } from '@/libs/redux';
import { getSessionAsync } from '@/libs/redux/slices/currentUserSlice/thunks';
import { Button } from '@heroui/react';
import Link from 'next/link';
import { Fragment, useEffect } from 'react';
import UserMenu from './UserMenu';

export default function AccountMenu() {
  const dispatch = useDispatch();
  const session = useSelector(state => state.currentUser.session);

  useEffect(() => {
    dispatch(getSessionAsync());
  }, [dispatch]);
  return (
    <div>
      {session ? (
        <UserMenu session={session} />
      ) : (
        <Fragment>
          <Button as={Link} href="/login" variant="bordered" className="text-white">
            login
          </Button>
          <Button variant="bordered" as={Link} href="/register" className="text-white">
            register
          </Button>
        </Fragment>
      )}
    </div>
  );
}
