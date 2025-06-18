import { OrderEnum } from 'src/enums/order.enum';
import { z } from 'zod';

/**
 * 创建基于 limit/offset 模式的分页参数校验 schema
 *
 * @param orderByEnum - 允许排序的字段枚举（如 UserOrderByFieldsEnum）
 * @returns 返回带 limit、offset、order、orderBy 的分页参数校验 schema
 *
 * 特性：
 * - limit：每页最大条数，默认 20，最大限制 100
 * - offset：跳过条数，默认 0
 * - order：排序方向，'ASC' 或 'DESC'，默认 'DESC'
 * - orderBy：排序字段，必须是指定 enum 中的合法值，默认 enum 中第一个值
 */
export function createOffsetPaginationSchema<T extends Record<string, string>>(orderByEnum: T) {
  return z.object({
    /**
     * 每页条数限制，默认 20，最大 100
     */
    limit: z
      .union([z.string(), z.number()])
      .optional()
      .transform(val => parseInt(String(val ?? '20'), 10))
      .refine(val => val > 0 && val <= 100, {
        message: 'Limit must be between 1 and 100',
      }),

    /**
     * 偏移量，用于跳过多少条数据，默认 0
     */
    offset: z
      .union([z.string(), z.number()])
      .optional()
      .transform(val => parseInt(String(val ?? '0'), 10))
      .refine(val => val >= 0, {
        message: 'Offset must be a non-negative number',
      }),

    /**
     * 排序方向，支持 ASC / DESC，默认 DESC（不区分大小写）
     */
    order: z
      .string()
      .optional()
      .transform(val => val?.toUpperCase() || OrderEnum.DESC)
      .refine((val): val is OrderEnum => Object.values(OrderEnum).includes(val as OrderEnum), {
        message: `Order must be either ${OrderEnum.ASC} or ${OrderEnum.DESC}`,
      }),

    /**
     * 排序字段，必须是传入的枚举中的合法字段，默认取 enum 的第一个值
     */
    orderBy: z
      .nativeEnum(orderByEnum)
      .optional()
      .default(Object.values(orderByEnum)[0] as T[keyof T]),
  });
}
