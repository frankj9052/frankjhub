'use client';

import { useSessionGuard } from '@/usehooks/useSessionGuard';
import { useEffect } from 'react';

export default function Page() {
  const session = useSessionGuard();
  useEffect(() => {
    console.log('session check => ', session);
  }, [session]);
  return <div className="h-[4000px]">clinic portal</div>;
}
