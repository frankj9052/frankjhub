import { ZodTypeAny } from 'zod';
import { z, zInfer } from '../libs/z';

/**
 * 创建通用分页响应 schema（支持类型推导和前后端一致性）
 *
 * 用于标准分页接口的响应结构校验与类型生成，典型格式如下：
 * {
 *   data: [...],           // 当前页的数据项
 *   total: 100,            // 总条目数
 *   pageCount: 10,         // 总页数（总条目数 / 每页条数 向上取整）
 *   currentPage: 2,        // 当前页码（从 1 开始或自定义）
 *   pageSize: 10,          // 当前页每页条数
 *   search: 'frank',       // 可选搜索关键词（回显用）
 *   filters: ['active', 'unverifiedEmail'] // 可选用户状态筛选（回显用）
 * }
 *
 * @param itemSchema - 用于单个数据项的 Zod schema（例如用户、文章等）
 * @returns 包含分页元信息的完整 schema（可用于校验与类型推导）
 */
export function createOffsetPaginatedResponseSchema<
  T extends ZodTypeAny,
  F extends ZodTypeAny = ReturnType<typeof z.array> // 泛型只为占位，真正的默认值在实现里内联
>(itemSchema: T, filtersSchema?: F) {
  return z.object({
    /**
     * 当前页数据数组
     */
    data: z.array(itemSchema),

    /**
     * 符合条件的总条目数
     */
    total: z.number().int().nonnegative(),

    /**
     * 总页数（总条目数 / pageSize 向上取整）
     */
    pageCount: z.number().int().nonnegative(),

    /**
     * 当前页码（通常从 1 开始）
     */
    currentPage: z.number().int().nonnegative(),

    /**
     * 每页条数
     */
    pageSize: z.number().int().nonnegative(),

    /**
     * 可选搜索关键词（通常用于回显搜索条件）
     */
    search: z.string().optional(),

    /**
     * 可选状态筛选（用于回显过滤条件）
     * - 值为字符串枚举数组，来源于 UserStatusFilterEnum
     */
    filters: (filtersSchema ?? z.array(z.string())).optional(),
  });
}

/**
 * 响应类型推导工具（供 TypeScript 类型使用）
 */
export type OffsetPaginatedZodResponse<T extends ZodTypeAny> = zInfer<
  ReturnType<typeof createOffsetPaginatedResponseSchema<T>>
>;
