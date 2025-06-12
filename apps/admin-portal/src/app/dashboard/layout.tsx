import { ReactNode } from 'react';
import { getSessionServer } from '../actions/auth';
import { redirect } from 'next/navigation';

export default async function layout({ children }: { children: ReactNode }) {
  const session = await getSessionServer();
  if (!session) {
    redirect('/login');
  }
  return (
    <div className="bg-gray-100 h-screen-minus-64">
      <div className="flex h-full">
        {/* 侧边栏 */}
        <div className="w-[250px] border-r-1 p-3"></div>
        {/* 主窗口 */}
        <div className="flex-1 p-3">{children}</div>
      </div>
    </div>
  );
}
