import { del, get, patch, post } from '@/libs/axios/client';
import {
  ApiResponse,
  idParamsSchema,
  ServiceCreateRequest,
  serviceCreateRequestSchema,
  ServiceListRequest,
  serviceListRequestSchema,
  ServiceListResponse,
  ServiceSingleResponse,
  ServiceUpdateRequest,
  serviceUpdateRequestSchema,
  SimpleResponse,
} from '@frankjhub/shared-schema';
import { validateInput } from '@frankjhub/shared-utils';

/** 管理端：服务列表（Query 方式） */
export async function getServiceList(
  query: ServiceListRequest
): Promise<ApiResponse<ServiceListResponse>> {
  const validationResult = validateInput(serviceListRequestSchema, query);
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await get<ServiceListResponse>('/api/service/list', {
    params: validationResult.data,
  });
  return response;
}

/** 管理端：创建服务 */
export async function createService(
  data: ServiceCreateRequest
): Promise<ApiResponse<SimpleResponse>> {
  const validationResult = validateInput(serviceCreateRequestSchema, data);
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await post<SimpleResponse>('/api/service', validationResult.data);
  return response;
}

/** 管理端：更新服务 */
export async function updateService(
  data: ServiceUpdateRequest
): Promise<ApiResponse<SimpleResponse>> {
  const validationResult = validateInput(serviceUpdateRequestSchema, data);
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await patch<SimpleResponse>('/api/service/update', validationResult.data);
  return response;
}

/** 管理端：软删除 */
export async function softDeleteService(id: string): Promise<ApiResponse<SimpleResponse>> {
  const validationResult = validateInput(idParamsSchema, { id });
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await patch<SimpleResponse>('/api/service/soft-delete', validationResult.data);
  return response;
}

/** 管理端：恢复 */
export async function restoreService(id: string): Promise<ApiResponse<SimpleResponse>> {
  const validationResult = validateInput(idParamsSchema, { id });
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await patch<SimpleResponse>('/api/service/restore', validationResult.data);
  return response;
}

/** 管理端：硬删除（query 传 id） */
export async function hardDeleteService(id: string): Promise<ApiResponse<SimpleResponse>> {
  const validationResult = validateInput(idParamsSchema, { id });
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await del<SimpleResponse>('/api/service/hard-delete', {
    params: validationResult.data,
  });
  return response;
}

/** 管理端：根据 ID 获取服务详情 */
export async function getServiceById(id: string): Promise<ApiResponse<ServiceSingleResponse>> {
  const validationResult = validateInput(idParamsSchema, { id });
  if (!validationResult.success) {
    return validationResult.error;
  }

  const response = await get<ServiceSingleResponse>(`/api/service/${validationResult.data.id}`);
  return response;
}
