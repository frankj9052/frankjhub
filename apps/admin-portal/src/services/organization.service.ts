import axios from 'axios';
import { ActionResult } from '@/types';
import {
  idParamsSchema,
  OrganizationListRequest,
  OrganizationListResponse,
} from '@frankjhub/shared-schema';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getAllOrganizations(
  pagination: OrganizationListRequest
): Promise<ActionResult<OrganizationListResponse>> {
  try {
    const res = await axios.get(`${baseURL}/api/organization/list`, {
      withCredentials: true,
      params: pagination,
    });
    return { status: 'success', data: res.data };
  } catch (err) {
    console.error(err);
    const message = axios.isAxiosError(err)
      ? err.response?.data?.details || err.message
      : 'Failed to fetch organizations';
    return { status: 'error', error: message };
  }
}

export async function getOrganizationById(
  id: string
): Promise<ActionResult<OrganizationWithOrgTypeNameSchema>> {
  try {
    const parsed = idParamsSchema.parse({ id });
    const res = await axios.get(`${baseURL}/api/organization/${parsed.id}`, {
      withCredentials: true,
    });
    return { status: 'success', data: res.data.data };
  } catch (err) {
    console.error(err);
    const message = axios.isAxiosError(err)
      ? err.response?.data?.details || err.message
      : 'Failed to fetch organization';
    return { status: 'error', error: message };
  }
}

export async function createOrganization(
  data: OrganizationCreateSchema
): Promise<ActionResult<string>> {
  try {
    const parsed = organizationCreateSchema.parse(data);
    await axios.post(`${baseURL}/api/organization`, parsed, {
      withCredentials: true,
    });
    return { status: 'success', data: 'Organization created successfully!' };
  } catch (err) {
    console.error(err);
    const message = axios.isAxiosError(err)
      ? err.response?.data?.details || err.message
      : 'Failed to create organization';
    return { status: 'error', error: message };
  }
}

export async function updateOrganization(
  data: OrganizationUpdateSchema
): Promise<ActionResult<string>> {
  try {
    const parsed = organizationUpdateSchema.parse(data);
    await axios.patch(`${baseURL}/api/organization/update`, parsed, {
      withCredentials: true,
    });
    return { status: 'success', data: 'Organization updated successfully!' };
  } catch (err) {
    console.error(err);
    const message = axios.isAxiosError(err)
      ? err.response?.data?.details || err.message
      : 'Failed to update organization';
    return { status: 'error', error: message };
  }
}

export async function softDeleteOrganization(id: string): Promise<ActionResult<string>> {
  try {
    const parsed = idParamsSchema.parse({ id });
    await axios.patch(
      `${baseURL}/api/organization/soft-delete`,
      { id: parsed.id },
      { withCredentials: true }
    );
    return { status: 'success', data: 'Organization soft-deleted successfully!' };
  } catch (err) {
    console.error(err);
    const message = axios.isAxiosError(err)
      ? err.response?.data?.details || err.message
      : 'Failed to soft-delete organization';
    return { status: 'error', error: message };
  }
}

export async function restoreOrganization(id: string): Promise<ActionResult<string>> {
  try {
    const parsed = idParamsSchema.parse({ id });
    await axios.patch(
      `${baseURL}/api/organization/restore`,
      { id: parsed.id },
      { withCredentials: true }
    );
    return { status: 'success', data: 'Organization restored successfully!' };
  } catch (err) {
    console.error(err);
    const message = axios.isAxiosError(err)
      ? err.response?.data?.details || err.message
      : 'Failed to restore organization';
    return { status: 'error', error: message };
  }
}

export async function hardDeleteOrganization(id: string): Promise<ActionResult<string>> {
  try {
    const parsed = idParamsSchema.parse({ id });
    await axios.delete(`${baseURL}/api/organization/hard-delete`, {
      withCredentials: true,
      params: { id: parsed.id },
    });
    return { status: 'success', data: 'Organization permanently deleted!' };
  } catch (err) {
    console.error(err);
    const message = axios.isAxiosError(err)
      ? err.response?.data?.details || err.message
      : 'Failed to hard-delete organization';
    return { status: 'error', error: message };
  }
}
