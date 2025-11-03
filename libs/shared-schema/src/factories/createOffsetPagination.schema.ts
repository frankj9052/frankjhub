import { input, output, ZodObject, ZodTypeAny } from 'zod';
import { OrderEnum } from '../enums/order.enum';
import { z } from '../libs/z';
import { createFiltersSchema, FilterDefsInput } from './createFilters.schema';

// 取对象 value 联合类型的小工具
// utils
type ValueOf<T> = T[keyof T];
type FilterValues<D> = {
  [K in keyof D]: ValueOf<D[K]>; // 将每个 key 对应的对象值取联合
};

type FiltersFromDefs<D> = D extends Record<string, Record<string, string>>
  ? {
      filters?: {
        any?: { key: keyof D; values: FilterValues<D>[keyof D][] }[];
        all?: { key: keyof D; values: FilterValues<D>[keyof D][] }[];
      };
    }
  : D extends Record<string, string>
  ? {
      filters?: {
        any?: { key: keyof D; values: D[keyof D][] }[];
        all?: { key: keyof D; values: D[keyof D][] }[];
      };
    }
  : {
      filters?: {
        any?: { key: string; values: string[] }[];
        all?: { key: string; values: string[] }[];
      };
    };

/**
 * 创建基于 limit/offset 分页模式的 Zod 校验 schema。
 *
 * @template T 排序字段枚举（如 UserOrderByFieldsEnum）
 * @template D 筛选条件的枚举定义集合（可选）
 *
 * @param orderByEnum - 排序字段枚举对象。枚举值应为允许排序的数据库字段名或业务字段名。
 * @param filterDefs  - （可选）筛选条件的维度定义，每个维度是一个枚举对象，key 为维度名，value 为该维度可选的值。
 *
 * @returns Zod schema，可直接用于请求参数验证。
 *
 * ---
 * ### 功能概述
 * 生成的 schema 支持：
 * 1. **分页参数**（limit、offset）
 * 2. **排序参数**（order、orderBy）
 * 3. **搜索关键词**（search）
 * 4. **可选筛选参数**（filters）
 *
 * ---
 * ### 字段说明
 *
 * #### 分页
 * - limit：每页条数，1~100 之间，默认 20
 * - offset：跳过的记录条数，≥ 0，默认 0
 *
 * #### 排序
 * - order：排序方向，'ASC' 或 'DESC'（大小写不敏感），默认 'DESC'
 * - orderBy：排序字段，必须是 orderByEnum 枚举值之一，默认取枚举的第一个值
 *
 * #### 搜索
 * - search：搜索关键词，最大长度 100，默认不传
 *
 * #### 筛选（filters）
 * 如果 filterDefs 为空，则不生成 filters 校验字段。
 * 如果提供了 filterDefs，filters 支持两种模式：
 *
 * 1. **扁平并集（OR）模式**
 * ```json
 * ["active", "source_organization"]
 * ```
 * - 直接传一个字符串数组，元素必须属于所有维度枚举值的合集
 * - 至少一个值
 * - 当枚举值在不同维度重复时会抛错（避免歧义）
 *
 * 2. **结构化模式**
 * ```json
 * {
 *   "any": [{ "key": "status", "values": ["active"] }],
 *   "all": [{ "key": "source", "values": ["source_organization"] }]
 * }
 * ```
 * - any：任意一个子条件匹配（OR 关系）
 * - all：所有子条件必须同时匹配（AND 关系）
 * - key 必须是 filterDefs 的维度名
 * - values 必须是对应维度枚举值之一，且至少一个值
 * - any 和 all 至少要提供一个
 *
 * ---
 * ### 使用示例
 *
 * #### 简单分页+排序
 * ```ts
 * const schema = createOffsetPaginationSchema(UserOrderByEnum);
 * const result = schema.parse({ limit: 10, orderBy: 'name' });
 * ```
 *
 * #### 带筛选
 * ```ts
 * const schema = createOffsetPaginationSchema(
 *   UserOrderByEnum,
 *   {
 *     status: { ACTIVE: 'active', INACTIVE: 'inactive' },
 *     source: { ORG: 'source_organization', TYPE: 'source_type' }
 *   }
 * );
 *
 * // 扁平模式
 * schema.parse({
 *   filters: ['active', 'source_organization']
 * });
 *
 * // 结构化模式
 * schema.parse({
 *   filters: {
 *     any: [{ key: 'status', values: ['active'] }],
 *     all: [{ key: 'source', values: ['source_organization'] }]
 *   }
 * });
 * ```
 */
export function createOffsetPaginationSchema<
  T extends Record<string, string>,
  D extends FilterDefsInput | undefined = undefined,
  DynamicFields extends readonly string[] = []
>(
  orderByEnum: T,
  filterDefs?: D,
  dynamicFields?: DynamicFields // 动态字符串维度，比如 ['serviceId', 'teamId']
) {
  // const filtersSchema = createFiltersSchema(filterDefs) ?? z.undefined();
  let filtersSchema: ReturnType<typeof createFiltersSchema> | undefined;

  if (filterDefs) {
    const isSingleDim = Object.values(filterDefs).every(v => typeof v === 'string');
    if (isSingleDim) {
      // 单维
      filtersSchema = createFiltersSchema(filterDefs as Record<string, string>);
    } else {
      // 多维
      filtersSchema = createFiltersSchema(filterDefs as Record<string, Record<string, string>>);
    }
  } else {
    filtersSchema = undefined;
  }
  let base = z.object({
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
  });

  // 动态字段
  if (dynamicFields && dynamicFields.length > 0) {
    const dynamicShape = dynamicFields.reduce((acc, key) => {
      acc[key] = z.string().optional();
      return acc;
    }, {} as Record<string, ZodTypeAny>);
    base = base.merge(z.object(dynamicShape));
  }

  // 如果提供了 filterDefs，则合并 filters 字段；否则直接返回 base
  const withFilters = filtersSchema ? base.merge(z.object({ filters: filtersSchema })) : base;

  return withFilters as unknown as ZodObject<
    any,
    any,
    any,
    output<typeof base> & FiltersFromDefs<D> & Record<DynamicFields[number], string | undefined>,
    input<typeof base> & FiltersFromDefs<D> & Record<DynamicFields[number], string | undefined>
  >;
}
