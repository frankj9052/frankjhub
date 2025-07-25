import {
  getAllOrganizationTypes,
  getOrganizationTypeById,
  getOrganizationTypesOptions,
} from '@/services/organizationType';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import {
  OrganizationTypeListRequest,
  OrganizationTypeListResponse,
  OrganizationTypeOptionListResponse,
  OrganizationTypeSingleResponse,
} from '@frankjhub/shared-schema';

export const getAllOrganizationTypesAsync = createAppAsyncThunk<
  OrganizationTypeListResponse,
  { pagination: OrganizationTypeListRequest }
>('organizationType/getAll', async ({ pagination }) => {
  const result = await getAllOrganizationTypes(pagination);
  if (result.status === 'success') {
    return result;
  } else {
    throw result;
  }
});

export const getOrganizationTypeByIdAsync = createAppAsyncThunk<
  OrganizationTypeSingleResponse,
  { id: string }
>('organizationType/getById', async ({ id }) => {
  const result = await getOrganizationTypeById(id);
  if (result.status === 'success') {
    return result;
  } else {
    throw result;
  }
});

export const getOrganizationTypeOptionsAsync =
  createAppAsyncThunk<OrganizationTypeOptionListResponse>('organizationType/options', async () => {
    const result = await getOrganizationTypesOptions();
    if (result.status === 'success') {
      return result;
    } else {
      throw result;
    }
  });
