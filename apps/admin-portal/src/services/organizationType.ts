import axios from 'axios';
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
import { convertZodIssuesToErrorDetails, validateInput } from '@frankjhub/shared-utils';
import { get, post } from '@/libs/axios/client';

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
  const validation = validateInput(organizationTypeUpdateRequestSchema, data);
  if (!validation.success) {
    return validation.error;
  }

  try {
    const parsed = organizationTypeUpdateSchema.parse(data);
    await axios.patch(`${baseURL}/api/organization-type/update`, parsed, {
      withCredentials: true,
    });
    return { status: 'success', data: 'Organization type updated successfully!' };
  } catch (err) {
    console.log(err);
    const message = axios.isAxiosError(err)
      ? err.response?.data?.details || err.message
      : 'Failed to update organization type';
    return { status: 'error', error: message };
  }
}

export async function softDeleteOrganizationType(id: string): Promise<ActionResult<string>> {
  try {
    const parsed = idParamsSchema.parse({ id });
    await axios.patch(
      `${baseURL}/api/organization-type/soft-delete`,
      { id: parsed.id },
      { withCredentials: true }
    );
    return { status: 'success', data: 'Organization type soft-deleted successfully!' };
  } catch (err) {
    console.error(err);
    const message = axios.isAxiosError(err)
      ? err.response?.data?.details || err.message
      : 'Failed to soft-delete organization type';
    return { status: 'error', error: message };
  }
}

export async function restoreOrganizationType(id: string): Promise<ActionResult<string>> {
  try {
    const parsed = idParamsSchema.parse({ id });
    await axios.patch(
      `${baseURL}/api/organization-type/restore`,
      { id: parsed.id },
      { withCredentials: true }
    );
    return { status: 'success', data: 'Organization type restored successfully!' };
  } catch (err) {
    console.error(err);
    const message = axios.isAxiosError(err)
      ? err.response?.data?.details || err.message
      : 'Failed to restore organization type';
    return { status: 'error', error: message };
  }
}

export async function hardDeleteOrganizationType(id: string): Promise<ActionResult<string>> {
  try {
    const parsed = idParamsSchema.parse({ id });
    await axios.delete(`${baseURL}/api/organization-type/hard-delete`, {
      withCredentials: true,
      params: { id: parsed.id },
    });
    return { status: 'success', data: 'Organization type permanently deleted!' };
  } catch (err) {
    console.error(err);
    const message = axios.isAxiosError(err)
      ? err.response?.data?.details || err.message
      : 'Failed to hard-delete organization type';
    return { status: 'error', error: message };
  }
}
