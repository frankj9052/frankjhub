import {
  getAllOrganizationTypes,
  getOrganizationTypeById,
  getOrganizationTypesOptions,
} from '@/services/organizationType';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import {
  OrganizationTypePaginatedResponse,
  OrganizationTypePaginationParams,
  OrganizationTypeSchema,
  OrgTypeOptionsSchema,
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

export const getOrganizationTypeOptionsAsync = createAppAsyncThunk<OrgTypeOptionsSchema>(
  'organizationType/options',
  async () => {
    const result = await getOrganizationTypesOptions();
    if (result.status === 'success') {
      return result.data;
    } else {
      throw null;
    }
  }
);
