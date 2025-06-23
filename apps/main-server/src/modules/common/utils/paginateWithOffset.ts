import { OffsetPaginatedResponse } from '@frankjhub/shared-schema';
import { FindOptionsWhere, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

/**
 * 通用分页查询函数（动态支持不同模块的 pagination schema 类型）
 *
 * @param repo - 实体仓库
 * @param where - 查询条件
 * @param pagination - 来自动态 zod schema 的解析结果
 */
export async function paginateWithOffset<
  T extends ObjectLiteral,
  P extends { limit: number; offset: number; order: 'ASC' | 'DESC'; orderBy: string & keyof T }
>({
  repo,
  where,
  pagination,
  modifyQueryBuilder,
}: {
  repo: Repository<T>;
  where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  pagination: P;
  modifyQueryBuilder?: (qb: SelectQueryBuilder<T>) => SelectQueryBuilder<T>;
}): Promise<OffsetPaginatedResponse<T>> {
  const { limit, offset, order, orderBy } = pagination;

  // 容错处理
  const safeLimit = Math.min(Math.max(limit ?? 20, 1), 100);
  const safeOffset = Math.max(offset ?? 0, 0);

  // QueryBuilder 用于更复杂的查询场景
  let qb = repo
    .createQueryBuilder('t')
    .take(safeLimit)
    .skip(safeOffset)
    .orderBy(`t.${orderBy}`, order);

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
  return result;
}
