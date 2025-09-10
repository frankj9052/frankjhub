import {
  UserOrganizationRoleSingleResponse,
  UserOrganizationRoleUpdateRequest,
} from '@frankjhub/shared-schema';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import {
  getUserOrganizationRoleByUserId,
  updateUserOrganizationRoleByUserId,
} from '@/services/userOrganizationRole.service';

export const updateUserOrganizationRoleByUserIdAsync = createAppAsyncThunk<
  UserOrganizationRoleSingleResponse,
  { data: UserOrganizationRoleUpdateRequest }
>('user-organization-role/update', async ({ data }, { rejectWithValue }) => {
  const result = await updateUserOrganizationRoleByUserId(data);
  if (result.status === 'success') {
    return result;
  } else {
    return rejectWithValue(result.message);
  }
});

export const getUserOrganizationRoleByUserIdAsync = createAppAsyncThunk<
  UserOrganizationRoleSingleResponse,
  { id: string }
>('user-organization-role/getByUserId', async ({ id }, { rejectWithValue }) => {
  const result = await getUserOrganizationRoleByUserId(id);
  if (result.status === 'success') {
    return result;
  } else {
    return rejectWithValue(result.message);
  }
});
