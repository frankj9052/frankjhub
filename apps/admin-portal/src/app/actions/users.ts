'use server';

import axios, { isAxiosError } from 'axios';
import { cookies } from 'next/headers';
import { userAllProfilePaginationSchema, UserPaginatedResponse } from '@frankjhub/shared-schema';
import { ActionResult } from '@/types';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

interface Props {
  pagination: {
    limit?: string | number;
    offset?: string | number;
    order?: string;
    orderBy?: string;
  };
}

export async function getUsersAllProfile({
  pagination,
}: Props): Promise<ActionResult<UserPaginatedResponse>> {
  try {
    const parsed = userAllProfilePaginationSchema.parse(pagination);
    const cookieStore = cookies(); // Next.js 提供的服务器端 cookie 获取工具
    const sid = (await cookieStore).get('sid')?.value;

    const res = await axios.get(`${baseURL}/api/user/users-all-profile`, {
      headers: {
        Cookie: `sid=${sid}`,
      },
      withCredentials: true,
      params: parsed,
    });
    return { status: 'success', data: res.data.data };
  } catch (err) {
    if (isAxiosError(err)) {
      return { status: 'error', error: err.message };
    }
    return { status: 'error', error: 'Unknown error' };
  }
}
