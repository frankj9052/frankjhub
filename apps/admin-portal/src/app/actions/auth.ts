'use server';

import { get } from '@/libs/axios/client';
import { ApiResponse, GetCurrentUserResponse } from '@frankjhub/shared-schema';
import { cookies } from 'next/headers';

export async function getSessionServer(): Promise<ApiResponse<GetCurrentUserResponse>> {
  const cookieStore = cookies(); // Next.js 提供的服务器端 cookie 获取工具
  const sid = (await cookieStore).get('sid')?.value;
  const response = await get<GetCurrentUserResponse>('/api/auth/current-user', {
    headers: {
      Cookie: `sid=${sid}`,
    },
  });
  return response;
}
