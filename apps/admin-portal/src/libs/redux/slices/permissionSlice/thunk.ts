import {
  PermissionListRequest,
  PermissionListResponse,
  PermissionOptionListResponse,
  PermissionSingleResponse,
} from '@frankjhub/shared-schema';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import {
  getPermissionById,
  getPermissionList,
  getPermissionOptions,
} from '@/services/permission.service';

export const getPermissionListAsync = createAppAsyncThunk<
  PermissionListResponse,
  { pagination: PermissionListRequest }
>('permission/list', async ({ pagination }) => {
  const result = await getPermissionList(pagination);
  if (result.status === 'success') {
    return result;
  } else {
    throw result;
  }
});

export const getPermissionOptionsAsync = createAppAsyncThunk<PermissionOptionListResponse>(
  'permission/option-list',
  async () => {
    const result = await getPermissionOptions();
    if (result.status === 'success') {
      return result;
    } else {
      throw result;
    }
  }
);

export const getPermissionByIdAsync = createAppAsyncThunk<PermissionSingleResponse, { id: string }>(
  'permission/getById',
  async ({ id }) => {
    const result = await getPermissionById(id);
    if (result.status === 'success') {
      return result;
    } else {
      throw result;
    }
  }
);
