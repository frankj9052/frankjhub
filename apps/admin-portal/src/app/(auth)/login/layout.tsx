import { getSessionServer } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getSessionServer();
  if (session?.status === 'success') {
    redirect('/');
  }

  return <div className="bg-gray-100 h-screen-minus-64">{children}</div>;
}
