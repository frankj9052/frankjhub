import { LoginSchema } from '@/libs/schemas/loginSchema';
import { ActionResult } from '@/types';
import axios from 'axios';

const baseURL = 'http://localhost:3100';

export async function loginClient(data: LoginSchema): Promise<ActionResult<any>> {
  try {
    const result = await axios.post(`${baseURL}/api/auth/login`, data, {
      withCredentials: true,
    });
    return { status: 'success', data: result.data };
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.details || error.message
      : 'Unknown login error';
    return { status: 'error', error: message };
  }
}

export async function getSessionClient() {
  try {
    const res = await axios.get(`${baseURL}/api/auth/current-user`, {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
}

export async function logoutClient() {
  try {
    await axios.get(`${baseURL}/api/auth/logout`, {
      withCredentials: true,
    });
    return { status: 'success' };
  } catch {
    return { status: 'error', error: 'Logout failed' };
  }
}
