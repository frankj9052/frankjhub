import { ReactNode } from 'react';
import { getSessionServer } from '../actions/auth';
import { redirect } from 'next/navigation';

export default async function layout({ children }: { children: ReactNode }) {
  const session = await getSessionServer();
  if (!session) {
    redirect('/login');
  }
  return <div className="bg-gray-100 h-screen-minus-64">{children}</div>;
}
