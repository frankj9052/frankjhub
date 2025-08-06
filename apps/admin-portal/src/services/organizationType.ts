import {
  ApiResponse,
  idParamsSchema,
  OrganizationTypeCreateRequest,
  organizationTypeCreateRequestSchema,
  OrganizationTypeListRequest,
  organizationTypeListRequestSchema,
  OrganizationTypeListResponse,
  OrganizationTypeOptionListResponse,
  OrganizationTypeSingleResponse,
  OrganizationTypeUpdateRequest,
  organizationTypeUpdateRequestSchema,
} from '@frankjhub/shared-schema';
import { ValidationError } from '@frankjhub/shared-errors';
import { convertZodIssuesToErrorDetails } from '@frankjhub/shared-utils';
import { del, get, patch, post } from '@/libs/axios/client';

export async function getAllOrganizationTypes(
  pagination: OrganizationTypeListRequest
): Promise<ApiResponse<OrganizationTypeListResponse>> {
  const parsedInput = organizationTypeListRequestSchema.safeParse(pagination);
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error)).toJSON();
    return error;
  }
  const response = await get<OrganizationTypeListResponse>('/api/organization-type/list', {
    params: parsedInput.data,
  });
  return response;
}

export async function getOrganizationTypesOptions(): Promise<
  ApiResponse<OrganizationTypeOptionListResponse>
> {
  const response = get<OrganizationTypeOptionListResponse>('/api/organization-type/options');
  return response;
}

export async function getOrganizationTypeById(
  id: string
): Promise<ApiResponse<OrganizationTypeSingleResponse>> {
  const parsedInput = idParamsSchema.safeParse({ id });
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error)).toJSON();
    return error;
  }
  const response = await get<OrganizationTypeSingleResponse>(
    `/api/organization-type/${parsedInput.data.id}`
  );
  return response;
}

export async function createOrganizationType(
  data: OrganizationTypeCreateRequest
): Promise<ApiResponse<OrganizationTypeSingleResponse>> {
  const parsedInput = organizationTypeCreateRequestSchema.safeParse(data);
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error)).toJSON();
    return error;
  }
  const response = await post<OrganizationTypeSingleResponse>(
    '/api/organization-type',
    parsedInput.data
  );
  return response;
}

export async function updateOrganizationType(
  data: OrganizationTypeUpdateRequest
): Promise<ApiResponse<OrganizationTypeSingleResponse>> {
  const parsedInput = organizationTypeUpdateRequestSchema.safeParse(data);
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error)).toJSON();
    return error;
  }
  const response = await patch<OrganizationTypeSingleResponse>(
    '/api/organization-type/update',
    parsedInput.data
  );
  return response;
}

export async function softDeleteOrganizationType(
  id: string
): Promise<ApiResponse<OrganizationTypeSingleResponse>> {
  const parsedInput = idParamsSchema.safeParse({ id });
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error)).toJSON();
    return error;
  }
  const response = await patch<OrganizationTypeSingleResponse>(
    '/api/organization-type/soft-delete',
    { id: parsedInput.data.id }
  );
  return response;
}

export async function restoreOrganizationType(
  id: string
): Promise<ApiResponse<OrganizationTypeSingleResponse>> {
  const parsedInput = idParamsSchema.safeParse({ id });
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error)).toJSON();
    return error;
  }
  const response = await patch<OrganizationTypeSingleResponse>('/api/organization-type/restore');
  return response;
}

export async function hardDeleteOrganizationType(
  id: string
): Promise<ApiResponse<OrganizationTypeSingleResponse>> {
  const parsedInput = idParamsSchema.safeParse({ id });
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error)).toJSON();
    return error;
  }
  const response = await del<OrganizationTypeSingleResponse>('/api/organization-type/hard-delete', {
    params: parsedInput.data.id,
  });
  return response;
}
