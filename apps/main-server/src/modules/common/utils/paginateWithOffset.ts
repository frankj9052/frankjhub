import { OffsetPaginatedResponse } from '@frankjhub/shared-schema';
import { FindOptionsWhere, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

/**
 * 通用分页查询函数（支持分页、排序、搜索、过滤和字段映射）
 *
 * @template T - 实体类型（Entity）
 * @template P - 分页参数类型（通常由 zod schema 推导）
 *
 * @param repo - TypeORM 实体仓库
 * @param where - 可选的 where 条件（可用于静态过滤）
 * @param pagination - 分页参数，包括 limit、offset、order、orderBy、search、filters 等
 * @param modifyQueryBuilder - 可选的函数，用于在查询构建中插入自定义逻辑（如联表、额外过滤等）
 * @param fieldMap - 可选的字段映射表，用于将前端传入的虚拟字段（如 'orgTypeName'）映射为实际的数据库字段（如 'orgType.name'）
 *
 * @returns OffsetPaginatedResponse<T> - 包含分页后的数据、总条数、分页信息，以及可选的搜索和过滤字段
 *
 * @example
 * const result = await paginateWithOffset({
 *   repo: organizationRepo,
 *   pagination: {
 *     limit: 10,
 *     offset: 0,
 *     order: 'ASC',
 *     orderBy: 'orgTypeName',
 *     search: 'clinic',
 *     filters: ['active'],
 *   },
 *   fieldMap: {
 *     orgTypeName: 'orgType.name',
 *   },
 *   modifyQueryBuilder: qb => qb.leftJoin('t.orgType', 'orgType'),
 * });
 */
export async function paginateWithOffset<
  T extends ObjectLiteral,
  P extends {
    limit: number;
    offset: number;
    order: 'ASC' | 'DESC';
    orderBy: keyof T | (string & {});
    search?: string;
    filters?: Record<string, any> | string[];
  }
>({
  repo,
  where,
  pagination,
  modifyQueryBuilder,
  fieldMap,
}: {
  repo: Repository<T>;
  where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  pagination: P;
  modifyQueryBuilder?: (qb: SelectQueryBuilder<T>) => SelectQueryBuilder<T>;
  fieldMap?: Record<string, string>;
}): Promise<OffsetPaginatedResponse<T>> {
  const { limit, offset, order, orderBy } = pagination;
  const realOrderBy = fieldMap?.[orderBy as string] ?? `t.${String(orderBy)}`;

  // 容错处理
  const safeLimit = Math.min(Math.max(limit ?? 20, 1), 100);
  const safeOffset = Math.max(offset ?? 0, 0);

  // QueryBuilder 用于更复杂的查询场景
  let qb = repo
    .createQueryBuilder('t')
    .take(safeLimit)
    .skip(safeOffset)
    .orderBy(realOrderBy, order);

  if (where) {
    qb = qb.where(where);
  }

  if (modifyQueryBuilder) {
    qb = modifyQueryBuilder(qb);
  }

  const [data, total] = await qb.getManyAndCount();

  const currentPage = Math.floor(safeOffset / safeLimit) + 1;

  const result: OffsetPaginatedResponse<T> = {
    data,
    total,
    pageCount: Math.ceil(total / safeLimit),
    currentPage,
    pageSize: limit,
  };

  if ('search' in pagination && typeof pagination.search === 'string') {
    result.search = pagination.search;
  }
  if (
    'filters' in pagination &&
    Array.isArray(pagination.filters) &&
    pagination.filters.every(item => typeof item === 'string')
  ) {
    result.filters = pagination.filters;
  }
  return result;
}
