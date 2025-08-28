import Providers from '@/components/Providers';
import './global.css';
import TopNav from '@/components/navbar/TopNav';
import { ReduxProviders } from '@/components/ReduxProviders';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const basePath = publicRuntimeConfig?.basePath || '';

export const metadata = {
  title: 'Welcome to admin portal',
  description: 'manage system',
  icons: {
    icon: `${basePath}/favicon.ico`,
    shortcut: `${basePath}/favicon.ico`,
    apple: `${basePath}/favicon.ico`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProviders>
      <html lang="en">
        <body>
          <Providers>
            <TopNav />
            {children}
          </Providers>
        </body>
      </html>
    </ReduxProviders>
  );
}
