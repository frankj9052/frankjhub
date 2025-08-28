'use client';

import { useDispatch, useSelector } from '@/libs/redux';
import { Button } from '@heroui/react';
import Link from 'next/link';
import { useEffect } from 'react';
import UserMenu from './UserMenu';
// import { getSessionAsync } from '@/libs/redux/slices/currentUserSlice/thunks';

export default function AccountMenu() {
  const dispatch = useDispatch();
  const session = useSelector(state => state.currentUser.session);
  useEffect(() => {
    // dispatch(getSessionAsync());
  }, [dispatch]);
  return (
    <div>
      {session && session.status === 'success' ? (
        <UserMenu />
      ) : (
        <div className="flex gap-3">
          <Button as={Link} href="/login" variant="bordered" className="text-white">
            login
          </Button>
        </div>
      )}
    </div>
  );
}
