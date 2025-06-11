import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { isAxiosError } from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getSessionAsync = createAsyncThunk('getCurrentUserSessionData', async () => {
  try {
    const { data } = await axios.get(`${baseUrl}/api/auth/current-user`, {
      withCredentials: true,
    });
    return data.data;
  } catch (err) {
    if (isAxiosError(err)) {
      throw err.response?.data;
    } else {
      throw null;
    }
  }
});

export const getUserProfileAsync = createAsyncThunk('getUserProfileData', async () => {
  try {
    const { data } = await axios.get(`${baseUrl}/api/user/current-user-profile`, {
      withCredentials: true,
    });
    return data.data;
  } catch (err) {
    if (isAxiosError(err)) {
      throw err.response?.data;
    } else {
      throw null;
    }
  }
});
