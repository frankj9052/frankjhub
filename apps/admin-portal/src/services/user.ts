import { ActionResult } from '@/types';
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getUserProfileClient(): Promise<ActionResult<any>> {
  try {
    const result = await axios.get(`${baseURL}/api/user/current-user-profile`, {
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
