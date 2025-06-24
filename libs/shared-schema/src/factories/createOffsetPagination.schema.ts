import { OrderEnum } from '../enums/order.enum';
import { z } from '../libs/z';

/**
 * 创建基于 limit/offset 模式的分页参数校验 schema
 *
 * @param orderByEnum - 允许排序的字段枚举（如 UserOrderByFieldsEnum）
 * @returns 返回包含分页、排序、搜索与状态筛选字段的校验 schema
 *
 * 特性说明：
 * - limit：每页最大条数，默认 20，最大限制 100
 * - offset：跳过条数，默认 0
 * - order：排序方向，可选 'ASC' 或 'DESC'，默认 'DESC'
 * - orderBy：排序字段，必须是指定 enum 中的合法值，默认 enum 中第一个值
 * - search：搜索关键词（模糊匹配），支持 0 到 100 字符之间的任意字符串
 * - filters：用户筛选，前端多选传入，用于后端按状态条件组合过滤
 */
export function createOffsetPaginationSchema<
  T extends Record<string, string>,
  F extends Record<string, string> | undefined = undefined
>(orderByEnum: T, filtersEnum?: F) {
  return z.object({
    /**
     * 每页条数限制
     * - 类型：number 或 string（自动转换）
     * - 默认值：20
     * - 最大值：100
     */
    limit: z
      .union([z.string(), z.number()])
      .optional()
      .transform(val => parseInt(String(val ?? '20'), 10))
      .refine(val => val > 0 && val <= 100, {
        message: 'Limit must be between 1 and 100',
      }),

    /**
     * 数据偏移量（用于跳过前面的数据）
     * - 类型：number 或 string（自动转换）
     * - 默认值：0
     * - 最小值：0
     */
    offset: z
      .union([z.string(), z.number()])
      .optional()
      .transform(val => parseInt(String(val ?? '0'), 10))
      .refine(val => val >= 0, {
        message: 'Offset must be a non-negative number',
      }),

    /**
     * 排序方向
     * - 类型：'ASC' | 'DESC'（不区分大小写）
     * - 默认值：'DESC'
     */
    order: z
      .string()
      .optional()
      .transform(val => val?.toUpperCase() || OrderEnum.DESC)
      .refine((val): val is OrderEnum => Object.values(OrderEnum).includes(val as OrderEnum), {
        message: `Order must be either ${OrderEnum.ASC} or ${OrderEnum.DESC}`,
      }),

    /**
     * 排序字段
     * - 类型：传入枚举中的合法字段值
     * - 默认值：枚举中的第一个字段
     */
    orderBy: z
      .nativeEnum(orderByEnum)
      .optional()
      .default(Object.values(orderByEnum)[0] as T[keyof T]),

    /**
     * 搜索关键词（用于模糊匹配）
     * - 类型：string
     * - 默认值：undefined（不搜索）
     * - 限制：最少 1 个字符，最多 100 个字符
     */
    search: z.string().trim().max(100, { message: 'Search keyword too long' }).optional(),

    /**
     * 用户状态筛选项（前端多选）
     * - 类型：UserFilters[]（枚举值数组）
     * - 值来源于 UserFilterEnum，包含 active、inactive、deleted 等
     * - 默认值：undefined（不进行状态过滤）
     */
    filters: filtersEnum
      ? z.array(z.nativeEnum(filtersEnum)).optional()
      : z.array(z.string()).optional(),
  });
}
