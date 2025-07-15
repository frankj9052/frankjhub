import { BaseErrorResponse } from '../modules/common/response/baseErrorResponse.schema';

// 定义响应泛型结构、错误结构
export type ApiResponse<T> = T | BaseErrorResponse;
