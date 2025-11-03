import { ZodType } from 'zod';
import { toZodEnum } from './enumUtils';
import { z } from '../libs/z';

/** 入参：单维或多维 defs，value=显示文案 */
export type FilterDefsInput = Record<string, string> | Record<string, Record<string, string>>;

/** 结构化 filters 的数据结构 */
export type FilterClause = { key: string; values: string[] };
export type StructuredFilters = { any?: FilterClause[]; all?: FilterClause[] };
export type FiltersInput = StructuredFilters | string[] | undefined | null;

type UnknownValuePolicy =
  | { onUnknown: 'error' } // 未知值抛错
  | { onUnknown: 'ignore' } // 未知值丢弃
  | { onUnknown: 'fallback'; flatKey: string }; // 未知值归并到 flatKey

/** 把单维/多维的 defs 统一成 { [key]: { literal: label } } */
function normalizeFilterDefs(
  defs?: Record<string, any>
): Record<string, Record<string, string>> | undefined {
  if (!defs) return undefined;
  const isSingleDim = Object.values(defs).every(v => typeof v === 'string');
  return isSingleDim
    ? { default: defs as Record<string, string> }
    : (defs as Record<string, Record<string, string>>);
}

/** 从 defs 构建运行时索引与约束（唯一可信源） */
export function buildFilterIndexes(filterDefs?: FilterDefsInput) {
  const defs = normalizeFilterDefs(filterDefs);
  const valueToKey = new Map<string, string>();
  const byKeyValues = new Map<string, Set<string>>();
  const keys = defs ? Object.keys(defs) : [];

  if (!defs || keys.length === 0) {
    return {
      defs: undefined as unknown as Record<string, Record<string, string>>,
      keys: [] as string[],
      valueToKey,
      byKeyValues,
    };
  }

  for (const key of keys) {
    const valueMap = defs[key]; // { literal: label }
    const literals = Object.keys(valueMap);
    const set = new Set<string>(literals);
    byKeyValues.set(key, set);

    for (const v of literals) {
      if (valueToKey.has(v)) {
        // 单点校验：不同维度不能出现相同 literal
        throw new Error(
          `Duplicate filter literal "${v}" across dimensions. ` +
            `Ensure values are unique OR use the structured { any/all } form.`
        );
      }
      valueToKey.set(v, key);
    }
  }

  return { defs, keys, valueToKey, byKeyValues };
}

/** ------------ 重载部分 START ------------ */
// 1) 没传 defs：返回 undefined
export function createFiltersSchema(): undefined;

// 2) 传的是单维：Record<string, string>
export function createFiltersSchema<D extends Record<string, string>>(
  filterDefs: D
): ZodType<{
  any?: { key: keyof D; values: (keyof D)[] }[];
  all?: { key: keyof D; values: (keyof D)[] }[];
}>;

// 3) 传的是多维：Record<string, Record<string, string>>
export function createFiltersSchema<const D extends Record<string, Record<string, string>>>(
  filterDefs: D
): ZodType<{
  any?: {
    [K in keyof D]: {
      key: K;
      values: (keyof D[K])[];
    };
  }[keyof D][];
  all?: {
    [K in keyof D]: {
      key: K;
      values: (keyof D[K])[];
    };
  }[keyof D][];
}>;
/** ------------ 重载部分 END ------------ */

/** 使用同一套索引，生成 filters 的 Zod schema（扁平 OR / 结构化 any+all） */

export function createFiltersSchema(filterDefs?: FilterDefsInput): ZodType<any> | undefined {
  if (!filterDefs) return undefined;

  const isSingleDim = Object.values(filterDefs).every(v => typeof v === 'string');

  // ---------- 单维 ----------
  if (isSingleDim) {
    const defs = filterDefs as Record<string, string>;
    const zEnum = toZodEnum(defs);

    const flatOR = z.array(zEnum);
    const structured = z.object({
      any: z
        .array(
          z.object({
            key: z.literal('default'),
            values: z.array(zEnum).min(1),
          })
        )
        .min(1)
        .optional(),
      all: z
        .array(
          z.object({
            key: z.literal('default'),
            values: z.array(zEnum).min(1),
          })
        )
        .min(1)
        .optional(),
    });

    return z.union([flatOR, structured]).optional();
  }

  // ---------- 多维 ----------
  // 这里我们确定它就是多维了，所以直接用刚才重载 2 的结构
  const defs = filterDefs as Record<string, Record<string, string>>;
  const keys = Object.keys(defs) as (keyof typeof defs)[];

  // 每一维的子 schema
  const perKeySchemas = keys.map(key => {
    const valueMap = defs[key]; // e.g. { ACTIVE: 'active', ... }
    // ⭐⭐ 注意：这里用的是“内层 key”做枚举，也就是 'ACTIVE' | 'INACTIVE' ...
    const zEnum = toZodEnum(valueMap);

    return z.object({
      key: z.literal(key),
      values: z.array(zEnum).min(1),
    });
  });

  const structured =
    perKeySchemas.length === 1
      ? z.object({
          any: z.array(perKeySchemas[0]).min(1).optional(),
          all: z.array(perKeySchemas[0]).min(1).optional(),
        })
      : z.object({
          any: z
            .array(z.union(perKeySchemas as any))
            .min(1)
            .optional(),
          all: z
            .array(z.union(perKeySchemas as any))
            .min(1)
            .optional(),
        });

  // 扁平（可选，如果你不想要可以去掉）
  const flatOR =
    perKeySchemas.length === 1
      ? z.array(toZodEnum(defs[keys[0]]))
      : z.array(z.union(keys.map(key => toZodEnum(defs[key])) as any));

  return z.union([flatOR, structured]).optional();
}

/** 把输入整形为结构化（与 schema 约束一致），并返回可变副本 */
export function ensureStructuredFiltersFromDefs(
  input: FiltersInput,
  filterDefs?: FilterDefsInput,
  policy: UnknownValuePolicy = { onUnknown: 'error' }
): StructuredFilters {
  if (!input) return {};

  const { valueToKey } = buildFilterIndexes(filterDefs);

  // 深拷贝工具：返回可变副本
  const cloneClauses = (clauses?: FilterClause[]) =>
    Array.isArray(clauses) ? clauses.map(c => ({ key: c.key, values: [...c.values] })) : undefined;

  // 已是结构化：仅深拷贝
  if (!Array.isArray(input)) {
    return {
      any: cloneClauses(input.any),
      all: cloneClauses(input.all),
    };
    // 注意：schema 校验交给外部 parse/安全边界来做
  }

  // 扁平数组：用 valueToKey 反推 key，并按 key 聚合
  const grouped = new Map<string, string[]>();

  for (const v of input) {
    const key = valueToKey.get(v);

    if (typeof key === 'string') {
      const arr = grouped.get(key);
      if (arr) arr.push(v);
      else grouped.set(key, [v]);
      continue;
    }

    // 处理未知值
    if (policy.onUnknown === 'error') {
      throw new Error(`Unknown filter value "${v}". Not present in filterDefs.`);
    }
    if (policy.onUnknown === 'ignore') {
      continue;
    }
    // fallback: 归并到 flatKey
    const arr = grouped.get(policy.flatKey);
    if (arr) arr.push(v);
    else grouped.set(policy.flatKey, [v]);
  }

  const any: FilterClause[] = [];
  for (const [key, values] of grouped) {
    if (values.length > 0) {
      any.push({ key, values: [...values] });
    }
  }

  return any.length > 0 ? { any } : {};
}

/** 与 schema 绑定的工具包：创建、整形、校验一站式 */
export function makeFiltersToolkit(filterDefs?: FilterDefsInput) {
  // 分支 1：没传 defs
  if (!filterDefs) {
    const schema = createFiltersSchema(); // ✅ 命中无参重载，返回 undefined
    return {
      schema,
      ensureStructured: (input: FiltersInput, policy?: UnknownValuePolicy) =>
        ensureStructuredFiltersFromDefs(input, undefined, policy ?? { onUnknown: 'error' }),
      parse: (input: unknown) => input, // 没 schema，直接回传
    };
  }

  // 分支 2：传的是“单维”
  if (Object.values(filterDefs).every(v => typeof v === 'string')) {
    const schema = createFiltersSchema(filterDefs as Record<string, string>);
    return {
      schema,
      ensureStructured: (input: FiltersInput, policy?: UnknownValuePolicy) =>
        ensureStructuredFiltersFromDefs(input, filterDefs, policy ?? { onUnknown: 'error' }),
      parse: (input: unknown) => schema.parse(input),
    };
  }

  // 分支 3：传的是“多维”
  const schema = createFiltersSchema(filterDefs as Record<string, Record<string, string>>);
  return {
    schema,
    ensureStructured: (input: FiltersInput, policy?: UnknownValuePolicy) =>
      ensureStructuredFiltersFromDefs(input, filterDefs, policy ?? { onUnknown: 'error' }),
    parse: (input: unknown) => schema.parse(input),
  };
}

// 小工具：只更新某个 key 的某个分组（any/all）
export function upsertClause(
  f: StructuredFilters,
  group: 'any' | 'all',
  key: 'status' | 'source',
  values: string[]
) {
  const list = (f[group] ?? []).filter(c => c.key !== key);
  if (values.length > 0) list.push({ key, values });
  f[group] = list.length ? list : undefined;
}
