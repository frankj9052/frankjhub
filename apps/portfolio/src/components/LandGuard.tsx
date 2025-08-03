'use client';
import { useSelector } from '@/libs/redux';
import { ReactNode } from 'react';
import { LandingAnimationPage } from './LandingAnimationPage';

export default function LandGuard({ children }: { children: ReactNode }) {
  const isFirstLoad = useSelector(state => state.systemSlice.isFirstLoad);
  return (
    <div>
      {isFirstLoad && <LandingAnimationPage />}
      {children}
    </div>
  );
}
