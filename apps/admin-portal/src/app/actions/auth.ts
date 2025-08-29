'use server';

import { get } from '@/libs/axios/client';
import { ApiResponse, GetCurrentUserResponse } from '@frankjhub/shared-schema';
import { cookies } from 'next/headers';

export async function getSessionServer(): Promise<ApiResponse<GetCurrentUserResponse>> {
  const cookieStore = await cookies();
  const sid = cookieStore.get('sid')?.value;
  if (!sid) {
    return {
      status: 401,
      code: 'Unauthorized',
      message: 'No cookies',
      timestamp: new Date().toISOString(),
    };
  }
  const headers = sid ? { Cookie: `sid=${sid}` } : undefined;
  const response = await get<GetCurrentUserResponse>('/api/auth/current-user', {
    headers,
  });
  return response;
}
