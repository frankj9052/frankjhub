import {
  ApiResponse,
  idParamsSchema,
  OrganizationCreateRequest,
  organizationCreateRequestSchema,
  OrganizationListRequest,
  organizationListRequestSchema,
  OrganizationListResponse,
  OrganizationOptionListResponse,
  OrganizationSingleResponse,
  OrganizationUpdateRequest,
  organizationUpdateRequestSchema,
} from '@frankjhub/shared-schema';
import { ValidationError } from '@frankjhub/shared-errors';
import { convertZodIssuesToErrorDetails } from '@frankjhub/shared-utils';
import { del, get, patch, post } from '@/libs/axios/client';

export async function getAllOrganizations(
  pagination: OrganizationListRequest
): Promise<ApiResponse<OrganizationListResponse>> {
  const parsedInput = organizationListRequestSchema.safeParse(pagination);
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error)).toJSON();
    return error;
  }
  const response = await get<OrganizationListResponse>('/api/organization/list', {
    params: parsedInput.data,
  });
  return response;
}

export async function getOrganizationOptionList(): Promise<
  ApiResponse<OrganizationOptionListResponse>
> {
  const response = get<OrganizationOptionListResponse>('/api/organization/options');
  return response;
}

export async function getOrganizationById(
  id: string
): Promise<ApiResponse<OrganizationSingleResponse>> {
  const parsedInput = idParamsSchema.safeParse({ id });
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error)).toJSON();
    return error;
  }
  const response = await get<OrganizationSingleResponse>(
    `/api/organization/${parsedInput.data.id}`
  );
  return response;
}

export async function createOrganization(
  data: OrganizationCreateRequest
): Promise<ApiResponse<OrganizationSingleResponse>> {
  const parsedInput = organizationCreateRequestSchema.safeParse(data);
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error)).toJSON();
    return error;
  }
  const response = await post<OrganizationSingleResponse>('/api/organization', parsedInput.data);
  return response;
}

export async function updateOrganization(
  data: OrganizationUpdateRequest
): Promise<ApiResponse<OrganizationSingleResponse>> {
  const parsedInput = organizationUpdateRequestSchema.safeParse(data);
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error)).toJSON();
    return error;
  }
  const response = await patch<OrganizationSingleResponse>(
    '/api/organization/update',
    parsedInput.data
  );
  return response;
}

export async function softDeleteOrganization(
  id: string
): Promise<ApiResponse<OrganizationSingleResponse>> {
  const parsedInput = idParamsSchema.safeParse({ id });
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error));
    return error.toJSON();
  }
  const response = await patch<OrganizationSingleResponse>(
    '/api/organization/soft-delete',
    parsedInput.data
  );
  return response;
}

export async function restoreOrganization(
  id: string
): Promise<ApiResponse<OrganizationSingleResponse>> {
  const parsedInput = idParamsSchema.safeParse({ id });
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error));
    return error.toJSON();
  }
  const response = await patch<OrganizationSingleResponse>(
    '/api/organization/restore',
    parsedInput.data
  );
  return response;
}

export async function hardDeleteOrganization(
  id: string
): Promise<ApiResponse<OrganizationSingleResponse>> {
  const parsedInput = idParamsSchema.safeParse({ id });
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error));
    return error.toJSON();
  }
  const response = await del<OrganizationSingleResponse>('/api/organization/hard-delete', {
    params: parsedInput.data,
  });
  return response;
}
