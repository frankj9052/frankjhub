import {
  RoleListRequest,
  RoleListResponse,
  RoleOptionListResponse,
  RoleSingleResponse,
} from '@frankjhub/shared-schema';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import { getRoleById, getRoleList, getRoleOptions } from '@/services/role.service';

export const getRoleListAsync = createAppAsyncThunk<
  RoleListResponse,
  { pagination: RoleListRequest }
>('role/list', async ({ pagination }) => {
  const result = await getRoleList(pagination);
  if (result.status === 'success') {
    return result;
  } else {
    throw result;
  }
});

export const getRoleOptionsAsync = createAppAsyncThunk<RoleOptionListResponse>(
  'role/option-list',
  async () => {
    const result = await getRoleOptions();
    if (result.status === 'success') {
      return result;
    } else {
      throw result;
    }
  }
);

export const getRoleByIdAsync = createAppAsyncThunk<RoleSingleResponse, { id: string }>(
  'role/getById',
  async ({ id }) => {
    const result = await getRoleById(id);
    if (result.status === 'success') {
      return result;
    } else {
      throw result;
    }
  }
);
