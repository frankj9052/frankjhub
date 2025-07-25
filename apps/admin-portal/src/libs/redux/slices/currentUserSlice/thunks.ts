import { getSessionClient } from '@/services/auth';
import { getUserProfileClient } from '@/services/user';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import { GetCurrentUserResponse, UserSingleResponse } from '@frankjhub/shared-schema';

export const getSessionAsync = createAppAsyncThunk<GetCurrentUserResponse>(
  'getCurrentUserSessionData',
  async () => {
    const result = await getSessionClient();
    if (result.status === 'success') {
      return result;
    } else {
      throw result;
    }
  }
);

export const getUserProfileAsync = createAppAsyncThunk<UserSingleResponse>(
  'getUserProfileData',
  async () => {
    const result = await getUserProfileClient();
    if (result.status === 'success') {
      return result;
    } else {
      throw result;
    }
  }
);
