import { ActionResult } from '@/types';
import {
  userAdminUpdateSchema,
  UserAdminUpdateSchema,
  userAllProfilePaginationSchema,
  UserAllProfileResponse,
  userIdParamsSchema,
  UserPaginatedResponse,
} from '@frankjhub/shared-schema';
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
    console.log(err);
    const message = axios.isAxiosError(err)
      ? err.response?.data?.details || err.message
      : 'Unknown get users error';
    return { status: 'error', error: message };
  }
}

export async function getUserAllProfileById({
  id,
}: {
  id: string;
}): Promise<ActionResult<UserAllProfileResponse>> {
  try {
    const parsed = userIdParamsSchema.parse({ id });
    const res = await axios.get(`${baseURL}/api/user/${parsed.id}`, {
      withCredentials: true,
    });
    return { status: 'success', data: res.data };
  } catch (err) {
    console.log(err);
    const message = axios.isAxiosError(err)
      ? err.response?.data?.details || err.message
      : 'Unknown get user error';
    return { status: 'error', error: message };
  }
}

export async function softDeleteUser(id: string): Promise<ActionResult<string>> {
  try {
    const parsed = userIdParamsSchema.parse({ id });
    await axios.patch(
      `${baseURL}/api/user/soft-delete`,
      {
        id: parsed.id,
      },
      {
        withCredentials: true,
      }
    );
    return { status: 'success', data: 'Delete successfully' };
  } catch (err) {
    console.log(err);
    const message = axios.isAxiosError(err)
      ? err.response?.data?.details || err.message
      : 'Unknown get user error';
    return { status: 'error', error: message };
  }
}

export async function restoreDeletedUser(id: string): Promise<ActionResult<string>> {
  try {
    const parsed = userIdParamsSchema.parse({ id });
    await axios.patch(
      `${baseURL}/api/user/restore`,
      {
        id: parsed.id,
      },
      {
        withCredentials: true,
      }
    );
    return { status: 'success', data: 'User restored successfully' };
  } catch (err) {
    console.log(err);
    const message = axios.isAxiosError(err)
      ? err.response?.data?.details || err.message
      : 'Unknown get user error';
    return { status: 'error', error: message };
  }
}

export async function hardDeleteUser(id: string): Promise<ActionResult<string>> {
  try {
    const parsed = userIdParamsSchema.parse({ id });
    await axios.delete(`${baseURL}/api/user/hard-delete`, {
      withCredentials: true,
      params: {
        id: parsed.id,
      },
    });
    return { status: 'success', data: 'User deleted permanently!' };
  } catch (err) {
    console.log(err);
    const message = axios.isAxiosError(err)
      ? err.response?.data?.details || err.message
      : 'Unknown get user error';
    return { status: 'error', error: message };
  }
}

export async function adminUpdateUser(data: UserAdminUpdateSchema): Promise<ActionResult<string>> {
  try {
    const parsed = userAdminUpdateSchema.parse(data);
    await axios.patch(
      `${baseURL}/api/user/admin-update`,
      { ...parsed },
      {
        withCredentials: true,
      }
    );
    return { status: 'success', data: 'User data updated!' };
  } catch (err) {
    console.log(err);
    const message = axios.isAxiosError(err)
      ? err.response?.data?.details || err.message
      : 'Unknown admin update user error';
    return { status: 'error', error: message };
  }
}
