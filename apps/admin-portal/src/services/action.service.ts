import { del, get, patch, post } from '@/libs/axios/client';
import {
  ActionCreateRequest,
  actionCreateRequestSchema,
  ActionListRequest,
  actionListRequestSchema,
  ActionListResponse,
  ActionOptionListResponse,
  ActionSingleResponse,
  ActionUpdateRequest,
  actionUpdateRequestSchema,
  ApiResponse,
  idParamsSchema,
} from '@frankjhub/shared-schema';
import { validateInput } from '@frankjhub/shared-utils';

export async function getActionList(
  pagination: ActionListRequest
): Promise<ApiResponse<ActionListResponse>> {
  const validationResult = validateInput(actionListRequestSchema, pagination);
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await get<ActionListResponse>('/api/action/list', {
    params: validationResult.data,
  });
  return response;
}

export async function getActionOptions(): Promise<ApiResponse<ActionOptionListResponse>> {
  const response = await get<ActionOptionListResponse>('/api/action/options');
  return response;
}

export async function getActionById(id: string): Promise<ApiResponse<ActionSingleResponse>> {
  const validationResult = validateInput(idParamsSchema, { id });
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await get<ActionSingleResponse>(`/api/action/${validationResult.data.id}`);
  return response;
}

export async function softDeleteAction(id: string): Promise<ApiResponse<ActionSingleResponse>> {
  const validationResult = validateInput(idParamsSchema, { id });
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await patch<ActionSingleResponse>(
    '/api/action/soft-delete',
    validationResult.data
  );
  return response;
}

export async function restoreAction(id: string): Promise<ApiResponse<ActionSingleResponse>> {
  const validationResult = validateInput(idParamsSchema, { id });
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await patch<ActionSingleResponse>('/api/action/restore', validationResult.data);
  return response;
}

export async function hardDeleteAction(id: string): Promise<ApiResponse<ActionSingleResponse>> {
  const validationResult = validateInput(idParamsSchema, { id });
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await del<ActionSingleResponse>('/api/action/hard-delete', {
    params: validationResult.data,
  });
  return response;
}

export async function updateAction(
  data: ActionUpdateRequest
): Promise<ApiResponse<ActionSingleResponse>> {
  const validationResult = validateInput(actionUpdateRequestSchema, data);
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await patch<ActionSingleResponse>('/api/action/update', validationResult.data);
  return response;
}

export async function createAction(
  data: ActionCreateRequest
): Promise<ApiResponse<ActionSingleResponse>> {
  const validationResult = validateInput(actionCreateRequestSchema, data);
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await post<ActionSingleResponse>('/api/action', validationResult.data);
  return response;
}
