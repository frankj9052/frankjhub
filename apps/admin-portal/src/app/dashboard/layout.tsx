import { ReactNode } from 'react';
import { getSessionServer } from '../actions/auth';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/sidebar/Sidebar';

export default async function layout({ children }: { children: ReactNode }) {
  const session = await getSessionServer();
  if (!session) {
    redirect('/login');
  }
  return (
    <div className="bg-gray-100 h-screen-minus-64">
      <div className="flex h-full">
        {/* 侧边栏 */}
        <Sidebar />
        {/* 主窗口 */}
        <div className="flex-1 p-3">{children}</div>
      </div>
    </div>
  );
}
