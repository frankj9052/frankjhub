import { getSessionClient } from '@/services/auth';
import { getUserProfileClient } from '@/services/user';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getSessionAsync = createAsyncThunk('getCurrentUserSessionData', async () => {
  const session = await getSessionClient();
  if (session) {
    return session.data;
  } else {
    throw null;
  }
});

export const getUserProfileAsync = createAsyncThunk('getUserProfileData', async () => {
  const userProfile = await getUserProfileClient();
  if (userProfile.status === 'success') {
    return userProfile.data.data;
  } else {
    throw null;
  }
});
