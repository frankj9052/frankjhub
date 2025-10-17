import { get, post } from '@/libs/axios/client';
import {
  ApiResponse,
  GetCurrentUserResponse,
  LoginRequest,
  loginRequestSchema,
  LoginResponse,
  SimpleResponse,
} from '@frankjhub/shared-schema';
import { validateInput } from '@frankjhub/shared-utils';

export async function login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  const validationResult = validateInput(loginRequestSchema, data);
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await post<LoginResponse>(`/api/auth/login`, validationResult.data);

  return response;
}

export async function getSession(): Promise<ApiResponse<GetCurrentUserResponse>> {
  const response = await get<GetCurrentUserResponse>(`/api/auth/current-user`);
  return response;
}

export async function logout(): Promise<ApiResponse<SimpleResponse>> {
  const response = await post<SimpleResponse>(`/api/auth/logout`);
  return response;
}
