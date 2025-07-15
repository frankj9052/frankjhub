// 暴露封装的 get/post/put/delete 方法

import { ApiResponse, BaseErrorResponse } from '@frankjhub/shared-schema';
import { AxiosRequestConfig } from 'axios';
import axiosInstance from './instance';

async function handleRequest<T>(
  method: 'get' | 'post' | 'patch' | 'delete',
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await axiosInstance.request<ApiResponse<T>>({
      method,
      url,
      data,
      ...config,
    });

    return response.data; // 保留结构: { status, data, message }
  } catch (error) {
    return error as BaseErrorResponse;
  }
}

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  return handleRequest<T>('get', url, undefined, config);
}

export async function post<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return handleRequest<T>('post', url, data, config);
}

export async function patch<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return handleRequest<T>('patch', url, data, config);
}

export async function del<T>(url: string, config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  return handleRequest<T>('delete', url, undefined, config);
}
