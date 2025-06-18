import { z } from 'zod';

/**
 * 创建通用分页响应 schema（支持类型推导和前后端一致性）
 *
 * 用于标准分页接口的响应结构校验与类型生成，典型格式如下：
 * {
 *   data: [...],           // 当前页的数据项
 *   total: 100,            // 总条目数
 *   pageCount: 10,         // 总页数（总条目数 / 每页条数 向上取整）
 *   currentPage: 2,        // 当前页码（从 1 开始或自定义）
 *   pageSize: 10           // 当前页每页条数
 * }
 *
 * @param itemSchema - 用于单个数据项的 Zod schema（例如用户、文章等）
 * @returns 包含分页元信息的完整 schema（可用于校验与类型推导）
 */
export function createOffsetPaginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    data: z.array(itemSchema),
    total: z.number().int().nonnegative(),
    pageCount: z.number().int().nonnegative(),
    currentPage: z.number().int().nonnegative(),
    pageSize: z.number().int().nonnegative(),
  });
}

export interface OffsetPaginatedResponse<T> {
  data: T[];
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}

// ✅ 加上 T extends z.ZodTypeAny 泛型约束
export type OffsetPaginatedZoeResponse<T extends z.ZodTypeAny> = z.infer<
  ReturnType<typeof createOffsetPaginatedResponseSchema<T>>
>;
