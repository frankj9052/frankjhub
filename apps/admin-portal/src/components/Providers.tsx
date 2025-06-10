import { HeroUIProvider } from '@heroui/react';
import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastContainer position="bottom-right" hideProgressBar className="z-50" />
      {children}
    </HeroUIProvider>
  );
}
