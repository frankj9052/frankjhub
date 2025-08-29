import { getSessionClient } from '@/services/auth';
import { getUserProfileClient } from '@/services/user';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import { GetCurrentUserResponse, UserSingleResponse } from '@frankjhub/shared-schema';

export const getSessionAsync = createAppAsyncThunk<GetCurrentUserResponse>(
  'getCurrentUserSessionData',
  async (_, { rejectWithValue }) => {
    const result = await getSessionClient();
    if (result?.status === 'success' || result === null) {
      return result;
    } else {
      return rejectWithValue(result.message);
    }
  }
);

export const getUserProfileAsync = createAppAsyncThunk<UserSingleResponse>(
  'getUserProfileData',
  async (_, { rejectWithValue }) => {
    const result = await getUserProfileClient();
    if (result.status === 'success') {
      return result;
    } else {
      return rejectWithValue(result.message);
    }
  }
);
