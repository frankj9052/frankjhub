'use client';

import { ReduxStore, reduxStore } from '@/libs/redux/store';
import { useRef, type ReactNode } from 'react';
import { Provider } from 'react-redux';

export const ReduxProviders = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<ReduxStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = reduxStore;
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
};
