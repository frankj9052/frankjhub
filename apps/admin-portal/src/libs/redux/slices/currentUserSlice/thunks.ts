import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getSessionAsync = createAsyncThunk('getCurrentUserSessionData', async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const { data } = await axios.get(`${baseUrl}/api/auth/current-user`);
    return data;
  } catch {
    return null;
  }
});
