import {
  getAllOrganizations,
  getOrganizationById,
  getOrganizationOptionList,
} from '@/services/organization.service';

import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import {
  OrganizationListRequest,
  OrganizationListResponse,
  OrganizationOptionListResponse,
  OrganizationSingleResponse,
} from '@frankjhub/shared-schema';

export const getAllOrganizationsAsync = createAppAsyncThunk<
  OrganizationListResponse,
  { pagination: OrganizationListRequest }
>('organization/getAll', async ({ pagination }) => {
  const result = await getAllOrganizations(pagination);
  if (result.status === 'success') {
    return result;
  } else {
    throw result;
  }
});

export const getOrganizationByIdAsync = createAppAsyncThunk<
  OrganizationSingleResponse,
  { id: string }
>('organization/getById', async ({ id }) => {
  const result = await getOrganizationById(id);
  if (result.status === 'success') {
    return result;
  } else {
    throw result;
  }
});

export const getOrganizationOptionListAsync = createAppAsyncThunk<OrganizationOptionListResponse>(
  'organization/options',
  async () => {
    const result = await getOrganizationOptionList();
    if (result.status === 'success') {
      return result;
    } else {
      throw result;
    }
  }
);
