'use client';

import { reduxStore, ReduxStore } from '@/libs/redux';
import { Children } from '@frankjhub/shared-ui-hero-ssr';
import { HeroUIProvider } from '@heroui/react';
import { useRef } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

interface ProviderProps {
  children: Children;
}
export const Providers = ({ children }: ProviderProps) => {
  const storeRef = useRef<ReduxStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = reduxStore;
  }
  return (
    <ReduxProvider store={storeRef.current}>
      <HeroUIProvider>
        <ToastContainer position="bottom-right" hideProgressBar className="z-50" />
        {children}
      </HeroUIProvider>
    </ReduxProvider>
  );
};
