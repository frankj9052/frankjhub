'use client';
import { Button } from '@heroui/react';
import Link from 'next/link';
import UserMenu from './UserMenu';
import { useDispatch, useSelector } from '@/libs/redux';
import { getSessionAsync } from '@/libs/redux/slices/currentUserSlice/thunks';
import { useEffect } from 'react';

export default function AccountMenu() {
  const session = useSelector(state => state.currentUser.session);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSessionAsync());
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
