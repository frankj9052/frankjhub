// axios 实例及拦截器
import { parseError } from '@frankjhub/shared-error-utils';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  response => response,
  error => Promise.reject(parseError(error))
);

export default axiosInstance;
