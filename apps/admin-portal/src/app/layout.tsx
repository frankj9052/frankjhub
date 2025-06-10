import Providers from '@/components/Providers';
import './global.css';
import TopNav from '@/components/navbar/TopNav';
import { ReduxProviders } from '@/components/ReduxProviders';

export const metadata = {
  title: 'Welcome to admin portal',
  description: 'manage system',
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
