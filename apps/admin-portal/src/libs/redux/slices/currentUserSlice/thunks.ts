import { getSessionClient } from '@/services/auth';
import { getUserProfileClient } from '@/services/user';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';

export const getSessionAsync = createAppAsyncThunk('getCurrentUserSessionData', async () => {
  const session = await getSessionClient();
  if (session) {
    return session.data;
  } else {
    throw null;
  }
});

export const getUserProfileAsync = createAppAsyncThunk('getUserProfileData', async () => {
  const userProfile = await getUserProfileClient();
  if (userProfile.status === 'success') {
    return userProfile.data.data;
  } else {
    throw null;
  }
});
