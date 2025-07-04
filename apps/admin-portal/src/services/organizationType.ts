import axios from 'axios';
import { ActionResult } from '@/types';
import {
  idParamsSchema,
  organizationTypeCreateSchema,
  OrganizationTypeCreateSchema,
  OrganizationTypePaginatedResponse,
  OrganizationTypePaginationParams,
  OrganizationTypeSchema,
  organizationTypeUpdateSchema,
  OrganizationTypeUpdateSchema,
  OrgTypeOptionsSchema,
} from '@frankjhub/shared-schema';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getAllOrganizationTypes(
  pagination: OrganizationTypePaginationParams
): Promise<ActionResult<OrganizationTypePaginatedResponse>> {
  try {
    const res = await axios.get(`${baseURL}/api/organization-type/list`, {
      withCredentials: true,
      params: {
        ...pagination,
      },
    });
    return { status: 'success', data: res.data };
  } catch (err) {
    console.log(err);
    const message = axios.isAxiosError(err)
      ? err.response?.data?.details || err.message
      : 'Failed to fetch organization types';
    return { status: 'error', error: message };
  }
}

export async function getOrganizationTypesOptions(): Promise<ActionResult<OrgTypeOptionsSchema>> {
  try {
    const res = await axios.get(`${baseURL}/api/organization-type/options`, {
      withCredentials: true,
    });
    return { status: 'success', data: res.data };
  } catch (err) {
    const message = axios.isAxiosError(err)
      ? err.response?.data?.details || err.message
      : 'Failed to fetch organization type options';
    return { status: 'error', error: message };
  }
}

export async function getOrganizationTypeById(
  id: string
): Promise<ActionResult<OrganizationTypeSchema>> {
  try {
    const parsed = idParamsSchema.parse({ id });
    const res = await axios.get(`${baseURL}/api/organization-type/${parsed.id}`, {
      withCredentials: true,
    });
    return { status: 'success', data: res.data.data };
  } catch (err) {
    console.log(err);
    const message = axios.isAxiosError(err)
      ? err.response?.data?.details || err.message
      : 'Failed to fetch organization type';
    return { status: 'error', error: message };
  }
}

export async function createOrganizationType(
  data: OrganizationTypeCreateSchema
): Promise<ActionResult<string>> {
  try {
    const parsed = organizationTypeCreateSchema.parse(data);
    await axios.post(`${baseURL}/api/organization-type`, parsed, {
      withCredentials: true,
    });
    return { status: 'success', data: 'Organization type created successfully!' };
  } catch (err) {
    console.log(err);
    const message = axios.isAxiosError(err)
      ? err.response?.data?.details || err.message
      : 'Failed to create organization type';
    return { status: 'error', error: message };
  }
}

export async function updateOrganizationType(
  data: OrganizationTypeUpdateSchema
): Promise<ActionResult<string>> {
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
