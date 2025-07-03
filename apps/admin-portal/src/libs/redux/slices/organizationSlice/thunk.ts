import {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  softDeleteOrganization,
  restoreOrganization,
  hardDeleteOrganization,
} from '@/services/organization.service';

import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import {
  OrganizationCreateSchema,
  OrganizationPaginatedResponse,
  OrganizationPaginationParams,
  OrganizationSchema,
  OrganizationUpdateSchema,
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

export const getOrganizationByIdAsync = createAppAsyncThunk<OrganizationSchema, { id: string }>(
  'organization/getById',
  async ({ id }) => {
    const result = await getOrganizationById(id);
    if (result.status === 'success') {
      return result.data;
    } else {
      throw null;
    }
  }
);

export const createOrganizationAsync = createAppAsyncThunk<
  string,
  { data: OrganizationCreateSchema }
>('organization/create', async ({ data }) => {
  const result = await createOrganization(data);
  if (result.status === 'success') {
    return result.data;
  } else {
    throw result.error;
  }
});

export const updateOrganizationAsync = createAppAsyncThunk<
  string,
  { data: OrganizationUpdateSchema }
>('organization/update', async ({ data }) => {
  const result = await updateOrganization(data);
  if (result.status === 'success') {
    return result.data;
  } else {
    throw result.error;
  }
});

export const softDeleteOrganizationAsync = createAppAsyncThunk<string, { id: string }>(
  'organization/softDelete',
  async ({ id }) => {
    const result = await softDeleteOrganization(id);
    if (result.status === 'success') {
      return result.data;
    } else {
      throw result.error;
    }
  }
);

export const restoreOrganizationAsync = createAppAsyncThunk<string, { id: string }>(
  'organization/restore',
  async ({ id }) => {
    const result = await restoreOrganization(id);
    if (result.status === 'success') {
      return result.data;
    } else {
      throw result.error;
    }
  }
);

export const hardDeleteOrganizationAsync = createAppAsyncThunk<string, { id: string }>(
  'organization/hardDelete',
  async ({ id }) => {
    const result = await hardDeleteOrganization(id);
    if (result.status === 'success') {
      return result.data;
    } else {
      throw result.error;
    }
  }
);
