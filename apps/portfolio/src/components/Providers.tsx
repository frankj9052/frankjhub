'use client';

import { ReactNode, useRef } from 'react';
import { reduxStore, ReduxStore } from '@/libs/redux';
import { Provider } from 'react-redux';

export default function Providers({ children }: { children: ReactNode }) {
  const storeRef = useRef<ReduxStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = reduxStore;
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}
