'use server';

import axios from 'axios';
import { cookies } from 'next/headers';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getUsersAllProfile() {
  try {
    const cookieStore = cookies(); // Next.js 提供的服务器端 cookie 获取工具
    const sid = (await cookieStore).get('sid')?.value;

    const res = await axios.get(`${baseURL}/api/user/users-all-profile`, {
      headers: {
        Cookie: `sid=${sid}`,
      },
      withCredentials: true,
    });
    return res.data.data;
  } catch {
    return null;
  }
}
