import { getUserAllProfileById, getUserOptionList, getUsersAllProfile } from '@/services/user';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import {
  UserListRequest,
  UserListResponse,
  UserOptionListRequest,
  UserOptionListResponse,
  UserSingleResponse,
} from '@frankjhub/shared-schema';

export const getUsersAllProfileAsync = createAppAsyncThunk<
  UserListResponse,
  { pagination: UserListRequest }
>('getUsersAllProfile', async ({ pagination }) => {
  const result = await getUsersAllProfile(pagination);
  if (result.status === 'success') {
    return result;
  } else {
    throw result;
  }
});

export const getUserAllProfileByIdAsync = createAppAsyncThunk<UserSingleResponse, { id: string }>(
  'getUserAllProfileById',
  async ({ id }) => {
    const result = await getUserAllProfileById({ id });
    if (result.status === 'success') {
      return result;
    } else {
      throw result;
    }
  }
);

export const getUserOptionListAsync = createAppAsyncThunk<
  UserOptionListResponse,
  { data: UserOptionListRequest }
>('user/options', async ({ data }, { rejectWithValue }) => {
  const result = await getUserOptionList(data);
  if (result.status === 'success') {
    return result;
  } else {
    return rejectWithValue(result.message);
  }
});
