import { del, get, patch, post } from '@/libs/axios/client';
import {
  PermissionCreateRequest,
  permissionCreateRequestSchema,
  PermissionListRequest,
  permissionListRequestSchema,
  PermissionListResponse,
  PermissionSingleResponse,
  PermissionUpdateRequest,
  permissionUpdateRequestSchema,
  ApiResponse,
  idParamsSchema,
  PermissionOptionListResponse,
} from '@frankjhub/shared-schema';
import { validateInput } from '@frankjhub/shared-utils';

export async function getPermissionList(
  pagination: PermissionListRequest
): Promise<ApiResponse<PermissionListResponse>> {
  const validationResult = validateInput(permissionListRequestSchema, pagination);
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await get<PermissionListResponse>('/api/permission/list', {
    params: validationResult.data,
  });
  return response;
}

export async function getPermissionOptions(): Promise<ApiResponse<PermissionOptionListResponse>> {
  const response = await get<PermissionOptionListResponse>('/api/permission/options');
  return response;
}

export async function getPermissionById(
  id: string
): Promise<ApiResponse<PermissionSingleResponse>> {
  const validationResult = validateInput(idParamsSchema, { id });
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await get<PermissionSingleResponse>(
    `/api/permission/${validationResult.data.id}`
  );
  return response;
}

export async function softDeletePermission(
  id: string
): Promise<ApiResponse<PermissionSingleResponse>> {
  const validationResult = validateInput(idParamsSchema, { id });
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await patch<PermissionSingleResponse>(
    '/api/permission/soft-delete',
    validationResult.data
  );
  return response;
}

export async function restorePermission(
  id: string
): Promise<ApiResponse<PermissionSingleResponse>> {
  const validationResult = validateInput(idParamsSchema, { id });
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await patch<PermissionSingleResponse>(
    '/api/permission/restore',
    validationResult.data
  );
  return response;
}

export async function hardDeletePermission(
  id: string
): Promise<ApiResponse<PermissionSingleResponse>> {
  const validationResult = validateInput(idParamsSchema, { id });
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await del<PermissionSingleResponse>('/api/permission/hard-delete', {
    params: validationResult.data,
  });
  return response;
}

export async function updatePermission(
  data: PermissionUpdateRequest
): Promise<ApiResponse<PermissionSingleResponse>> {
  const validationResult = validateInput(permissionUpdateRequestSchema, data);
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await patch<PermissionSingleResponse>(
    '/api/permission/update',
    validationResult.data
  );
  console.log('check params ===> ', validationResult.data);
  return response;
}

export async function createPermission(
  data: PermissionCreateRequest
): Promise<ApiResponse<PermissionSingleResponse>> {
  const validationResult = validateInput(permissionCreateRequestSchema, data);
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await post<PermissionSingleResponse>('/api/permission', validationResult.data);
  return response;
}
