import { get } from '@/libs/axios/client';
import { ActionResult } from '@/types';
import {
  ApiResponse,
  idParamsSchema,
  UserListRequest,
  userListRequestSchema,
  UserListResponse,
  UserSingleResponse,
} from '@frankjhub/shared-schema';
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getUserProfileClient(): Promise<ApiResponse<UserSingleResponse>> {
  const response = await get<UserSingleResponse>('/api/user/current-user-profile');
  return response;
}

export async function getUsersAllProfile(
  pagination: UserListRequest
): Promise<ApiResponse<UserListResponse>> {
  const parsedInput = userListRequestSchema.safeParse(pagination);
  const response = await get<UserListResponse>(`/api/user/list`, {
    params: parsed,
  });
  if (!parsedInput.success) {
    return {
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Invalid get user list request',
      details: parsedInput.error.issues,
      timestamp: new Date().toISOString(),
    };
  }
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
    const parsed = idParamsSchema.parse({ id });
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
    const parsed = idParamsSchema.parse({ id });
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
    const parsed = idParamsSchema.parse({ id });
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
    const parsed = idParamsSchema.parse({ id });
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
