import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { getSessionServer } from '../actions/auth';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getSessionServer();
  if (session?.status !== 'success') {
    redirect('/login');
  }

  return (
    <div className="bg-gray-100 h-screen-minus-64">
      <div className="flex h-full">
        {/* 侧边栏 */}
        <Sidebar />
        {/* 主窗口 */}
        <div className="flex-1 p-3 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
