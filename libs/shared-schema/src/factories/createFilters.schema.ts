import { ZodDiscriminatedUnion, ZodDiscriminatedUnionOption, ZodEnum, ZodTypeAny } from 'zod';
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

/** 使用同一套索引，生成 filters 的 Zod schema（扁平 OR / 结构化 any+all） */
export function createFiltersSchema(filterDefs?: FilterDefsInput) {
  const { defs, keys } = buildFilterIndexes(filterDefs);
  if (!defs || keys.length === 0) return undefined;

  // 为每个 key 生成枚举 schema
  const byKeyEnum: Record<string, ZodEnum<[string, ...string[]]>> = {};
  const enumList: ZodEnum<[string, ...string[]]>[] = [];

  for (const key of keys) {
    const zEnum = toZodEnum(defs[key]); // 将 {literal: label} -> z.enum([...literal])
    byKeyEnum[key] = zEnum;
    enumList.push(zEnum);
  }

  // 扁平 OR：["ACTIVE", "ORG", ...]，多维时用 union
  const flatOR: ZodTypeAny =
    enumList.length === 1
      ? z.array(enumList[0])
      : z.array(z.union(enumList as unknown as [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]));

  // 结构化：{ any?: Clause[]; all?: Clause[] } 且至少提供一个字段
  const perKeyClauseSchemas = keys.map(key =>
    z.object({
      key: z.literal(key),
      values: z.array(byKeyEnum[key]).min(1),
    })
  ) as unknown as ZodDiscriminatedUnionOption<'key'>[];

  const clauseSchema:
    | ZodDiscriminatedUnionOption<'key'>
    | ZodDiscriminatedUnion<
        'key',
        [ZodDiscriminatedUnionOption<'key'>, ...ZodDiscriminatedUnionOption<'key'>[]]
      > =
    perKeyClauseSchemas.length === 1
      ? perKeyClauseSchemas[0]
      : z.discriminatedUnion(
          'key',
          perKeyClauseSchemas as [
            ZodDiscriminatedUnionOption<'key'>,
            ...ZodDiscriminatedUnionOption<'key'>[]
          ]
        );

  const structured = z
    .object({
      any: z.array(clauseSchema).min(1).optional(),
      all: z.array(clauseSchema).min(1).optional(),
    })
    .refine(o => {
      const hasAny = Array.isArray(o.any) && o.any.length > 0;
      const hasAll = Array.isArray(o.all) && o.all.length > 0;
      return hasAny || hasAll;
    }, 'Either "any" or "all" must be provided.');

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
  const schema = createFiltersSchema(filterDefs);

  return {
    schema,
    /** 扁平/结构化输入 -> 结构化（可变副本） */
    ensureStructured: (input: FiltersInput, policy?: UnknownValuePolicy) =>
      ensureStructuredFiltersFromDefs(input, filterDefs, policy ?? { onUnknown: 'error' }),
    /** 可选：严格校验（若未提供 defs，schema 为 undefined） */
    parse: (input: unknown) => (schema ? schema.parse(input) : input),
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
