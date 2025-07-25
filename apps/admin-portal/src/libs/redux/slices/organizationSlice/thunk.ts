import { getAllOrganizations, getOrganizationById } from '@/services/organization.service';

import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import {
  OrganizationListRequest,
  OrganizationListResponse,
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
