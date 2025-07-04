import { getAllOrganizations, getOrganizationById } from '@/services/organization.service';

import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import {
  OrganizationPaginatedResponse,
  OrganizationPaginationParams,
  OrganizationWithOrgTypeNameSchema,
} from '@frankjhub/shared-schema';

export const getAllOrganizationsAsync = createAppAsyncThunk<
  OrganizationPaginatedResponse,
  { pagination: OrganizationPaginationParams }
>('organization/getAll', async ({ pagination }) => {
  const result = await getAllOrganizations(pagination);
  if (result.status === 'success') {
    return result.data;
  } else {
    throw null;
  }
});

export const getOrganizationByIdAsync = createAppAsyncThunk<
  OrganizationWithOrgTypeNameSchema,
  { id: string }
>('organization/getById', async ({ id }) => {
  const result = await getOrganizationById(id);
  if (result.status === 'success') {
    return result.data;
  } else {
    throw null;
  }
});
