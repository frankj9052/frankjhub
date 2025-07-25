import { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import type { ZodError, ZodIssue } from 'zod';
import axios from 'axios';
import { BaseErrorResponse, baseErrorResponseSchema } from '@frankjhub/shared-schema';

// export function handleFormServerErrors<TFieldValues extends FieldValues>(
//   errorResponse: { error: string | ZodIssue[] },
//   setError: UseFormSetError<TFieldValues>
// ) {
//   if (Array.isArray(errorResponse.error)) {
//     errorResponse.error.forEach(e => {
//       const fieldName = e.path.join('.') as Path<TFieldValues>;
//       setError(fieldName, { message: e.message });
//     });
//   } else {
//     setError('root.serverError', { message: errorResponse.error });
//   }
// } 过时版本，用下面的

export function handleFormServerErrors<TFieldValues extends FieldValues>(
  errorResponse: BaseErrorResponse,
  setError: UseFormSetError<TFieldValues>
) {
  const details = errorResponse.details;
  const message = errorResponse.message;

  // 如果是 Zod-like 错误数组
  if (
    Array.isArray(details) &&
    details.every(e => Array.isArray(e.path) && typeof e.message === 'string')
  ) {
    const issues = details as ZodIssue[];
    issues.forEach(issue => {
      const field = issue.path.join('.') as Path<TFieldValues>;
      setError(field, { message: issue.message });
    });
    return;
  }

  // 如果是简单字符串消息
  if (typeof details === 'string') {
    setError('root.serverError', { message: details });
    return;
  }

  // fallback: 显示 message 或兜底
  setError('root.serverError', {
    message: message || 'An unknown error occurred.',
  });
}

/**
 * 尝试解析服务器返回的错误对象为 BaseErrorResponse
 */
export function parseError(error: unknown): BaseErrorResponse {
  if (
    axios.isAxiosError(error) &&
    error.response?.data &&
    typeof error.response.data === 'object'
  ) {
    const parsed = baseErrorResponseSchema.safeParse(error.response.data);
    if (parsed.success) return parsed.data;
  }
  return {
    status: 500,
    code: 'UNHANDLED_CLIENT_ERROR',
    message: error instanceof Error ? error.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  };
}

/**
 * 从未知错误对象中提取可展示的用户友好错误消息。
 *
 * 适用于处理 Axios 请求错误、标准后端错误响应（符合 BaseError 格式）、
 * 原生 Error 对象以及未知错误格式的情况。
 *
 * 处理逻辑：
 * - 若为 AxiosError 且响应体符合 BaseErrorResponseSchema，则返回标准 message 字段
 * - 若响应体包含通用 message 字段，则返回它
 * - 若以上不满足，则返回 Axios 的原始错误 message
 * - 若为普通 Error 对象，返回其 message
 * - 若无法识别错误结构，返回传入的 fallbackMessage（默认为 'Unexpected error'）
 *
 * @param error - 任意未知错误对象（可能来自 Axios、服务端、代码抛出等）
 * @param fallbackMessage - 无法提取具体信息时使用的默认错误信息
 * @returns 提取到的用户可读错误信息字符串
 */
export function getErrorMessage(error: unknown, fallbackMessage = 'Unexpected error'): string {
  // axios 错误
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;

    // 尝试匹配符合 BaseError 结构的后端响应
    const parsed = baseErrorResponseSchema.safeParse(responseData);
    if (parsed.success) {
      return parsed.data.message;
    }
    // 若 response.data 是普通对象且含有 message 字段
    if (
      responseData &&
      typeof responseData === 'object' &&
      'message' in responseData &&
      typeof responseData.message === 'string'
    ) {
      return responseData.message;
    }

    // fallback: axios 自带 message
    return error.message;
  }

  // 原生 Error 对象
  if (error instanceof Error) {
    return error.message;
  }

  // fallback
  return fallbackMessage;
}

export function convertZodIssuesToErrorDetails(error: ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.') || 'root';
    result[path] = issue.message;
  }
  return result;
}
