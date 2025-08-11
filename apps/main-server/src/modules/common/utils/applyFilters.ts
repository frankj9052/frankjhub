import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

/** 结构化 filters 的形状（与你的 schema 对齐） */
export type StructuredFilters = {
  any?: Array<{ key: string; values: string[] }>;
  all?: Array<{ key: string; values: string[] }>;
};

function isStructuredFilters(f: unknown): f is StructuredFilters {
  return !!f && typeof f === 'object' && !Array.isArray(f);
}

/** 传入配置：维度 → 值 → SQL 条件片段；以及统一的 query 参数 */
export type FilterConfig = {
  /** 维度映射：例如 { status:{active:'...',...}, source:{source_organization:'...',...} } */
  byKey: Record<string, Record<string, string>>;
  /** andWhere 时统一注入的参数（如 { srcOrg: RoleSource.ORG } ） */
  params?: Record<string, any>;
};

/**
 * 将 filters（扁平 OR / 结构化 any+all）转成 SQL 并注入到 qb
 * 语义： (OR(any 子句)) AND (AND(all 子句))
 * 同一子句内部：同一维度的 values 用 OR 连接
 */
export function applyFilters<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  filters: unknown,
  cfg: FilterConfig
) {
  if (!filters) return qb;

  // 1) 合并扁平映射（跨维度值必须唯一；你的 createFiltersSchema 已经保证重名会报错）
  const flatCondMap: Record<string, string> = {};
  for (const condMap of Object.values(cfg.byKey)) {
    for (const [val, sql] of Object.entries(condMap)) {
      if (flatCondMap[val]) {
        throw new Error(
          `Duplicate filter literal "${val}" across dimensions in FilterConfig.byKey`
        );
      }
      flatCondMap[val] = sql;
    }
  }

  // 2) 扁平 OR：['active','source_organization', ...]
  if (Array.isArray(filters)) {
    const parts = filters.map(v => flatCondMap[v]).filter(Boolean);
    if (parts.length) qb.andWhere(`(${parts.join(' OR ')})`, cfg.params ?? {});
    return qb;
  }

  // 3) 结构化：{ any:[{key,values}], all:[{key,values}] }
  if (isStructuredFilters(filters)) {
    const toSql = (clause: { key: string; values: string[] }) => {
      const condMap = cfg.byKey[clause.key] || {};
      const subs = clause.values.map(v => condMap[v]).filter(Boolean);
      return subs.length ? `(${subs.join(' OR ')})` : null;
    };

    const anyParts = (filters.any ?? []).map(toSql).filter(Boolean) as string[];
    const allParts = (filters.all ?? []).map(toSql).filter(Boolean) as string[];

    const whereParts: string[] = [];
    if (anyParts.length) whereParts.push(`(${anyParts.join(' OR ')})`);
    if (allParts.length) whereParts.push(`(${allParts.join(' AND ')})`);

    if (whereParts.length) qb.andWhere(whereParts.join(' AND '), cfg.params ?? {});
    return qb;
  }

  return qb;
}
