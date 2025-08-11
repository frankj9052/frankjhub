import { ZodDiscriminatedUnionOption, ZodEnum, ZodTypeAny } from 'zod';
import { toZodEnum } from './enumUtils';
import { z } from '../libs/z';

// 统一的入参类型（保持你原来的定义）
export type FilterDefsInput = Record<string, string> | Record<string, Record<string, string>>;

// 如果只有一条filter, 扁平化处理
function normalizeFilterDefs<D extends Record<string, any> | undefined>(
  defs?: D
): Record<string, Record<string, string>> | undefined {
  if (!defs) return undefined;
  const isSingleDim = Object.values(defs).every(v => typeof v === 'string');
  return isSingleDim
    ? { default: defs as unknown as Record<string, string> } // 单维度自动包一层
    : (defs as unknown as Record<string, Record<string, string>>);
}

// ✅ 抽出：根据 defs 生成 filters 的 Zod schema（扁平 OR / 结构化 any+all）
export function createFiltersSchema(filterDefs?: FilterDefsInput) {
  const defsNorm = normalizeFilterDefs(filterDefs);
  if (!defsNorm || Object.keys(defsNorm).length === 0) {
    return undefined; // 没有 filters
  }

  const defs: Record<string, Record<string, string>> = defsNorm;
  const keys = Object.keys(defsNorm) as (keyof typeof defsNorm)[];
  const byKeyEnum: Record<string, ZodEnum<[string, ...string[]]>> = {};
  const allEnumSchemas: ZodEnum<[string, ...string[]]>[] = [];
  const valueToKey = new Map<string, string>();

  for (const k of keys) {
    const keyStr = k as string;
    const zEnum = toZodEnum(defs[keyStr]);
    byKeyEnum[keyStr] = zEnum;
    allEnumSchemas.push(zEnum);

    for (const v of zEnum.options as readonly string[]) {
      if (valueToKey.has(v)) {
        throw new Error(
          `Duplicate filter literal "${v}" across dimensions. ` +
            `Please ensure values are unique OR use the structured { any/all } form.`
        );
      }
      valueToKey.set(v, keyStr);
    }
  }

  // 扁平 OR：["active", "source_organization"]
  let flatOR: ZodTypeAny;
  if (allEnumSchemas.length === 1) {
    flatOR = z.array(allEnumSchemas[0]);
  } else {
    const [first, second, ...rest] = allEnumSchemas;
    flatOR = z.array(
      z.union([first, second, ...rest] as [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]])
    );
  }

  // 结构化：{ any?: Array<{key,values}>, all?: Array<{key,values}> } 至少给一个
  type DiscriminatedOption = ZodDiscriminatedUnionOption<'key'>;
  const perKeyClauses = keys.map(k =>
    z.object({
      key: z.literal(k as string),
      values: z.array(byKeyEnum[k as string]).min(1),
    })
  ) as unknown as DiscriminatedOption[];

  let clause: ZodTypeAny;
  if (perKeyClauses.length === 1) {
    clause = perKeyClauses[0];
  } else {
    const [c1, c2, ...crest] = perKeyClauses;
    clause = z.discriminatedUnion('key', [c1, c2, ...crest] as [
      DiscriminatedOption,
      DiscriminatedOption,
      ...DiscriminatedOption[]
    ]);
  }

  const structured = z
    .object({
      any: z.array(clause).min(1).optional(),
      all: z.array(clause).min(1).optional(),
    })
    .refine(o => (o.any && o.any.length) || (o.all && o.all.length), {
      message: 'Either "any" or "all" must be provided.',
      path: ['any'],
    });

  return z.union([flatOR, structured]).optional();
}
