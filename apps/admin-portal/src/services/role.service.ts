import { del, get, patch, post } from '@/libs/axios/client';
import {
  ApiResponse,
  idParamsSchema,
  RoleCreateRequest,
  roleCreateRequestSchema,
  RoleListRequest,
  roleListRequestSchema,
  RoleListResponse,
  RoleOptionListResponse,
  RoleSingleResponse,
  RoleUpdateRequest,
  roleUpdateRequestSchema,
} from '@frankjhub/shared-schema';
import { validateInput } from '@frankjhub/shared-utils';

/**
 * 获取角色列表（分页/筛选）
 */
export async function getRoleList(
  pagination: RoleListRequest
): Promise<ApiResponse<RoleListResponse>> {
  const validationResult = validateInput(roleListRequestSchema, pagination);
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await get<RoleListResponse>('/api/role/list', {
    params: validationResult.data,
  });
  return response;
}

/**
 * 下拉选项：角色简表
 */
export async function getRoleOptions(): Promise<ApiResponse<RoleOptionListResponse>> {
  const response = await get<RoleOptionListResponse>('/api/role/options');
  return response;
}

/**
 * 按 ID 获取单个角色
 */
export async function getRoleById(id: string): Promise<ApiResponse<RoleSingleResponse>> {
  const validationResult = validateInput(idParamsSchema, { id });
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await get<RoleSingleResponse>(`/api/role/${validationResult.data.id}`);
  return response;
}

/**
 * 软删除角色
 */
export async function softDeleteRole(id: string): Promise<ApiResponse<RoleSingleResponse>> {
  const validationResult = validateInput(idParamsSchema, { id });
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await patch<RoleSingleResponse>('/api/role/soft-delete', validationResult.data);
  return response;
}

/**
 * 恢复已软删除的角色
 */
export async function restoreRole(id: string): Promise<ApiResponse<RoleSingleResponse>> {
  const validationResult = validateInput(idParamsSchema, { id });
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await patch<RoleSingleResponse>('/api/role/restore', validationResult.data);
  return response;
}

/**
 * 硬删除角色
 */
export async function hardDeleteRole(id: string): Promise<ApiResponse<RoleSingleResponse>> {
  const validationResult = validateInput(idParamsSchema, { id });
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await del<RoleSingleResponse>('/api/role/hard-delete', {
    params: validationResult.data,
  });
  return response;
}

/**
 * 更新角色
 */
export async function updateRole(
  data: RoleUpdateRequest
): Promise<ApiResponse<RoleSingleResponse>> {
  const validationResult = validateInput(roleUpdateRequestSchema, data);
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await patch<RoleSingleResponse>('/api/role/update', validationResult.data);
  // console.log('check params ===> ', validationResult.data);
  return response;
}

/**
 * 创建角色
 */
export async function createRole(
  data: RoleCreateRequest
): Promise<ApiResponse<RoleSingleResponse>> {
  const validationResult = validateInput(roleCreateRequestSchema, data);
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await post<RoleSingleResponse>('/api/role', validationResult.data);
  return response;
}
