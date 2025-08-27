'use server';

import { serverAxios } from '@/libs/axios/server';
import { ApiResponse, GetCurrentUserResponse } from '@frankjhub/shared-schema';
import { headers } from 'next/headers';

export async function getSessionServer(): Promise<ApiResponse<GetCurrentUserResponse>> {
  const cookieHeader = (await headers()).get('cookie') ?? '';
  const response = await serverAxios.get<GetCurrentUserResponse>('/api/auth/current-user', {
    headers: {
      cookie: cookieHeader,
    },
  });
  return response.data;
}
