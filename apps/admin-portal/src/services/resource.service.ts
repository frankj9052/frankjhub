import { del, get, patch, post } from '@/libs/axios/client';
import {
  ResourceCreateRequest,
  resourceCreateRequestSchema,
  ResourceListRequest,
  resourceListRequestSchema,
  ResourceListResponse,
  ResourceSingleResponse,
  ResourceUpdateRequest,
  resourceUpdateRequestSchema,
  ApiResponse,
  idParamsSchema,
  ResourceOptionListResponse,
} from '@frankjhub/shared-schema';
import { validateInput } from '@frankjhub/shared-utils';

export async function getResourceList(
  pagination: ResourceListRequest
): Promise<ApiResponse<ResourceListResponse>> {
  const validationResult = validateInput(resourceListRequestSchema, pagination);
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await get<ResourceListResponse>('/api/resource/list', {
    params: validationResult.data,
  });
  return response;
}

export async function getResourceOptions(): Promise<ApiResponse<ResourceOptionListResponse>> {
  const response = await get<ResourceOptionListResponse>('/api/resource/options');
  return response;
}

export async function getResourceById(id: string): Promise<ApiResponse<ResourceSingleResponse>> {
  const validationResult = validateInput(idParamsSchema, { id });
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await get<ResourceSingleResponse>(`/api/resource/${validationResult.data.id}`);
  return response;
}

export async function softDeleteResource(id: string): Promise<ApiResponse<ResourceSingleResponse>> {
  const validationResult = validateInput(idParamsSchema, { id });
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await patch<ResourceSingleResponse>(
    '/api/resource/soft-delete',
    validationResult.data
  );
  return response;
}

export async function restoreResource(id: string): Promise<ApiResponse<ResourceSingleResponse>> {
  const validationResult = validateInput(idParamsSchema, { id });
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await patch<ResourceSingleResponse>(
    '/api/resource/restore',
    validationResult.data
  );
  return response;
}

export async function hardDeleteResource(id: string): Promise<ApiResponse<ResourceSingleResponse>> {
  const validationResult = validateInput(idParamsSchema, { id });
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await del<ResourceSingleResponse>('/api/resource/hard-delete', {
    params: validationResult.data,
  });
  return response;
}

export async function updateResource(
  data: ResourceUpdateRequest
): Promise<ApiResponse<ResourceSingleResponse>> {
  const validationResult = validateInput(resourceUpdateRequestSchema, data);
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await patch<ResourceSingleResponse>(
    '/api/resource/update',
    validationResult.data
  );
  return response;
}

export async function createResource(
  data: ResourceCreateRequest
): Promise<ApiResponse<ResourceSingleResponse>> {
  const validationResult = validateInput(resourceCreateRequestSchema, data);
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await post<ResourceSingleResponse>('/api/resource', validationResult.data);
  return response;
}
