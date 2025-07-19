import { del, get, patch } from '@/libs/axios/client';
import {
  ApiResponse,
  idParamsSchema,
  UserListRequest,
  userListRequestSchema,
  UserListResponse,
  UserSingleResponse,
  UserUpdateRequest,
  userUpdateRequestSchema,
} from '@frankjhub/shared-schema';
import { ValidationError } from '@frankjhub/shared-errors';
import { convertZodIssuesToErrorDetails } from '@frankjhub/shared-utils';

export async function getUserProfileClient(): Promise<ApiResponse<UserSingleResponse>> {
  const response = await get<UserSingleResponse>('/api/user/current-user-profile');
  return response;
}

export async function getUsersAllProfile(
  pagination: UserListRequest
): Promise<ApiResponse<UserListResponse>> {
  const parsedInput = userListRequestSchema.safeParse(pagination);
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error)).toJSON();
    return error;
  }
  const response = await get<UserListResponse>(`/api/user/list`, {
    params: parsedInput,
  });
  return response;
}

export async function getUserAllProfileById({
  id,
}: {
  id: string;
}): Promise<ApiResponse<UserSingleResponse>> {
  const parsedInput = idParamsSchema.safeParse({ id });
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error)).toJSON();
    return error;
  }
  const response = await get<UserSingleResponse>(`/api/user/${parsedInput.data.id}`);
  return response;
}

export async function softDeleteUser(id: string): Promise<ApiResponse<UserSingleResponse>> {
  const parsedInput = idParamsSchema.safeParse({ id });
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error)).toJSON();
    return error;
  }
  const response = await patch<UserSingleResponse>(`/api/user/soft-delete`, { id: parsedInput });
  return response;
}

export async function restoreDeletedUser(id: string): Promise<ApiResponse<UserSingleResponse>> {
  const parsedInput = idParamsSchema.safeParse({ id });
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error)).toJSON();
    return error;
  }
  const response = await patch<UserSingleResponse>(`/api/user/restore`, { id: parsedInput });
  return response;
}

export async function hardDeleteUser(id: string): Promise<ApiResponse<UserSingleResponse>> {
  const parsedInput = idParamsSchema.safeParse({ id });
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error)).toJSON();
    return error;
  }
  const response = await del<UserSingleResponse>(`/api/user/hard-delete`, {
    params: {
      id: parsedInput.data.id,
    },
  });
  return response;
}

export async function adminUpdateUser(
  data: UserUpdateRequest
): Promise<ApiResponse<UserSingleResponse>> {
  const parsedInput = userUpdateRequestSchema.safeParse(data);
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error)).toJSON();
    return error;
  }
  const response = await patch<UserSingleResponse>('/api/user/admin-update', {
    ...parsedInput.data,
  });
  return response;
}
