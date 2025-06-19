import { ActionResult } from '@/types';
import { userAllProfilePaginationSchema, UserPaginatedResponse } from '@frankjhub/shared-schema';
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getUserProfileClient(): Promise<ActionResult<any>> {
  try {
    const result = await axios.get(`${baseURL}/api/user/current-user-profile`, {
      withCredentials: true,
    });
    return { status: 'success', data: result.data };
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.details || error.message
      : 'Unknown login error';
    return { status: 'error', error: message };
  }
}

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

    const res = await axios.get(`${baseURL}/api/user/users-all-profile`, {
      withCredentials: true,
      params: parsed,
    });
    return { status: 'success', data: res.data };
  } catch (err) {
    const message = axios.isAxiosError(err)
      ? err.response?.data?.details || err.message
      : 'Unknown get users error';
    return { status: 'error', error: message };
  }
}
