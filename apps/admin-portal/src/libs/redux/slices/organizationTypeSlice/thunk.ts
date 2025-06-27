import {
  getAllOrganizationTypes,
  getOrganizationTypeById,
  createOrganizationType,
  updateOrganizationType,
  softDeleteOrganizationType,
  restoreOrganizationType,
  hardDeleteOrganizationType,
} from '@/services/organizationType';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import {
  OrganizationTypeCreateSchema,
  OrganizationTypePaginatedResponse,
  OrganizationTypePaginationParams,
  OrganizationTypeSchema,
  OrganizationTypeUpdateSchema,
} from '@frankjhub/shared-schema';

export const getAllOrganizationTypesAsync = createAppAsyncThunk<
  OrganizationTypePaginatedResponse,
  { pagination: OrganizationTypePaginationParams }
>('organizationType/getAll', async ({ pagination }) => {
  const result = await getAllOrganizationTypes(pagination);
  if (result.status === 'success') {
    return result.data;
  } else {
    throw null;
  }
});

export const getOrganizationTypeByIdAsync = createAppAsyncThunk<
  OrganizationTypeSchema,
  { id: string }
>('organizationType/getById', async ({ id }) => {
  const result = await getOrganizationTypeById(id);
  if (result.status === 'success') {
    return result.data;
  } else {
    throw null;
  }
});

export const createOrganizationTypeAsync = createAppAsyncThunk<
  string,
  { data: OrganizationTypeCreateSchema }
>('organizationType/create', async ({ data }) => {
  const result = await createOrganizationType(data);
  if (result.status === 'success') {
    return result.data;
  } else {
    throw result.error;
  }
});

export const updateOrganizationTypeAsync = createAppAsyncThunk<
  string,
  { data: OrganizationTypeUpdateSchema }
>('organizationType/update', async ({ data }) => {
  const result = await updateOrganizationType(data);
  if (result.status === 'success') {
    return result.data;
  } else {
    throw result.error;
  }
});

export const softDeleteOrganizationTypeAsync = createAppAsyncThunk<string, { id: string }>(
  'organizationType/softDelete',
  async ({ id }) => {
    const result = await softDeleteOrganizationType(id);
    if (result.status === 'success') {
      return result.data;
    } else {
      throw result.error;
    }
  }
);

export const restoreOrganizationTypeAsync = createAppAsyncThunk<string, { id: string }>(
  'organizationType/restore',
  async ({ id }) => {
    const result = await restoreOrganizationType(id);
    if (result.status === 'success') {
      return result.data;
    } else {
      throw result.error;
    }
  }
);

export const hardDeleteOrganizationTypeAsync = createAppAsyncThunk<string, { id: string }>(
  'organizationType/hardDelete',
  async ({ id }) => {
    const result = await hardDeleteOrganizationType(id);
    if (result.status === 'success') {
      return result.data;
    } else {
      throw result.error;
    }
  }
);
