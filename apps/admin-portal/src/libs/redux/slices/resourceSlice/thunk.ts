import {
  ResourceListRequest,
  ResourceListResponse,
  ResourceOptionListResponse,
  ResourceSingleResponse,
} from '@frankjhub/shared-schema';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import { getResourceById, getResourceList, getResourceOptions } from '@/services/resource.service';

export const getResourceListAsync = createAppAsyncThunk<
  ResourceListResponse,
  { pagination: ResourceListRequest }
>('resource/list', async ({ pagination }) => {
  const result = await getResourceList(pagination);
  if (result.status === 'success') {
    return result;
  } else {
    throw result;
  }
});

export const getResourceOptionsAsync = createAppAsyncThunk<ResourceOptionListResponse>(
  'resource/option-list',
  async () => {
    const result = await getResourceOptions();
    if (result.status === 'success') {
      return result;
    } else {
      throw result;
    }
  }
);

export const getResourceByIdAsync = createAppAsyncThunk<ResourceSingleResponse, { id: string }>(
  'resource/getById',
  async ({ id }) => {
    const result = await getResourceById(id);
    if (result.status === 'success') {
      return result;
    } else {
      throw result;
    }
  }
);
