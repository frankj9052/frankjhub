import { GetCurrentUserResponse } from '@frankjhub/shared-schema';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import { getSession } from '@/services/auth.services';

export const getSessionAsync = createAppAsyncThunk<GetCurrentUserResponse>(
  'auth/current-user',
  async (_, { rejectWithValue }) => {
    const result = await getSession();
    if (result?.status === 'success' || result === null) {
      return result;
    } else {
      return rejectWithValue(result.message);
    }
  }
);
