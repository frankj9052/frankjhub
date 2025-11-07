import { Brackets, ObjectLiteral, SelectQueryBuilder } from 'typeorm';

/** 结构化 filters 的形状（与 schema 对齐） */
export type StructuredFilters = {
  any?: Array<{ key: string; values: string[] }>;
  all?: Array<{ key: string; values: string[] }>;
};

function isStructuredFilters(f: unknown): f is StructuredFilters {
  return !!f && typeof f === 'object' && !Array.isArray(f);
}

type SqlPart = string | Brackets;

type FilterDefs = Record<string, Record<string, SqlPart> | ((value: any) => SqlPart)>;

/** 传入配置：维度 → 值 → SQL 条件片段；以及统一的 query 参数 */
export type FilterConfig = {
  /** 维度映射：例如 { status:{active:'...',...}, source:{source_organization:'...',...} } */
  byKey: FilterDefs;
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
  filters: Record<string, any> | undefined,
  cfg: FilterConfig
) {
  if (!filters) return qb;

  // 1) 合并扁平映射（跨维度值必须唯一；createFiltersSchema 已经保证重名会报错）
  const flatCondMap: Record<string, SqlPart> = {};
  for (const condMap of Object.values(cfg.byKey)) {
    for (const [val, sql] of Object.entries(condMap)) {
      flatCondMap[val] = sql;
    }
  }

  // 2) 扁平 OR：['active','source_organization', ...]
  if (Array.isArray(filters)) {
    const parts = filters.map(v => flatCondMap[v]).filter(Boolean) as SqlPart[];
    if (parts.length) {
      qb.andWhere(
        new Brackets(b => {
          for (const p of parts) {
            b.orWhere(p as any);
          }
        }),
        cfg.params ?? {}
      );
    }
    return qb;
  }

  // 3) 结构化：{ any:[{key,values}], all:[{key,values}] }
  if (isStructuredFilters(filters)) {
    // 将某一维度 clause 转成 “该维度内部的 OR 组合”
    const clauseToBrackets = (clause: { key: string; values: string[] }): SqlPart | null => {
      const handler = cfg.byKey[clause.key];
      if (!handler) return null;

      // ✅ 支持函数式动态过滤
      if (typeof handler === 'function') {
        const part = handler(clause.values);
        return typeof part === 'string' ? new Brackets(qb => qb.where(part)) : part;
      }

      // ✅ 保留原本静态映射逻辑
      const condMap = handler || {};
      const subs = clause.values.map(v => condMap[v]).filter(Boolean) as SqlPart[];
      if (!subs.length) return null;

      return new Brackets(bb => {
        for (const p of subs) {
          bb.orWhere(p as any);
        }
      });
    };

    const anyGroups = (filters.any ?? []).map(clauseToBrackets).filter(Boolean) as Brackets[];
    const allGroups = (filters.all ?? []).map(clauseToBrackets).filter(Boolean) as Brackets[];

    // (OR(any...)) AND (AND(all...))
    if (anyGroups.length) {
      qb.andWhere(
        new Brackets(b => {
          for (const g of anyGroups) b.orWhere(g);
        }),
        cfg.params ?? {}
      );
    }
    for (const g of allGroups) {
      qb.andWhere(g, cfg.params ?? {});
    }
    return qb;
  }

  return qb;
}
