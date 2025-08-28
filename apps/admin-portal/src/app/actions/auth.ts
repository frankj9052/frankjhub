'use server';

import { get } from '@/libs/axios/client';
import { ApiResponse, GetCurrentUserResponse } from '@frankjhub/shared-schema';
import { cookies } from 'next/headers';

export async function getSessionServer(): Promise<ApiResponse<GetCurrentUserResponse>> {
  const cookieStore = await cookies();
  const sid = cookieStore.get('sid')?.value;
  const response = await get<GetCurrentUserResponse>('/api/auth/current-user', {
    headers: {
      cookie: sid,
    },
  });
  return response;
}
