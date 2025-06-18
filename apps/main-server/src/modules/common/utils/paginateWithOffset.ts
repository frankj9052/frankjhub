import { FindOptionsWhere, ObjectLiteral, Repository, FindOptionsOrder } from 'typeorm';
import { OffsetPaginatedResponse } from '../schemas/createOffsetPaginatedResponse.schema';

/**
 * 通用分页查询函数（动态支持不同模块的 pagination schema 类型）
 *
 * @param repo - 实体仓库
 * @param where - 查询条件
 * @param pagination - 来自动态 zod schema 的解析结果
 */
export async function paginateWithOffset<
  T extends ObjectLiteral,
  P extends { limit: number; offset: number; order: 'ASC' | 'DESC'; orderBy: keyof T }
>({
  repo,
  where,
  pagination,
}: {
  repo: Repository<T>;
  where?: FindOptionsWhere<T>;
  pagination: P;
}): Promise<OffsetPaginatedResponse<T>> {
  const { limit, offset, order, orderBy } = pagination;

  const [data, total] = await repo.findAndCount({
    where,
    take: limit,
    skip: offset,
    order: {
      [orderBy]: order,
    } as FindOptionsOrder<T>,
  });

  const currentPage = Math.floor(offset / limit) + 1;

  return {
    data,
    total,
    pageCount: Math.ceil(total / limit),
    currentPage,
    pageSize: limit,
  };
}
