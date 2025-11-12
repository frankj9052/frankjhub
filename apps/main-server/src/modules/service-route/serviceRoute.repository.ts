import { Brackets, DataSource, EntityManager, FindOneOptions } from 'typeorm';
import { ServiceRoute } from './entities/ServiceRoute';
import {
  ServiceRouteComposite,
  ServiceRouteCreateRequest,
  ServiceRouteListRequest,
  ServiceRouteUpdateRequest,
} from '@frankjhub/shared-schema';
import { BadRequestError, ForbiddenError, NotFoundError } from '@frankjhub/shared-errors';
import { paginateWithOffset } from '../common/utils/paginateWithOffset';
import { col } from '@frankjhub/shared-typeorm-utils';
import { applyFilters } from '../common/utils/applyFilters';

type ServiceRouteRelationKeys = 'service' | 'scopes';

export class ServiceRouteRepository {
  constructor(private dataSource: DataSource) {}

  private repo(manager?: EntityManager) {
    return (manager ?? this.dataSource.manager).getRepository(ServiceRoute);
  }

  private mergeFindOptionsWithRelations(
    findOptions: FindOneOptions<ServiceRoute>,
    withRelations?: boolean | ServiceRouteRelationKeys[]
  ): FindOneOptions<ServiceRoute> {
    const mergedOptions = { ...findOptions };

    if (withRelations) {
      if (withRelations === true) {
        mergedOptions.relations = { service: true, scopes: true };
      } else if (Array.isArray(withRelations)) {
        mergedOptions.relations = {
          ...(mergedOptions.relations ?? {}),
          ...withRelations.reduce<Record<string, boolean>>((acc, key) => {
            acc[key] = true;
            return acc;
          }, {}),
        };
      }
    }
    return mergedOptions;
  }

  /** create */
  async create(
    dto: ServiceRouteCreateRequest,
    options?: {
      createdBy?: string;
      manager?: EntityManager;
    }
  ) {
    const manager = options?.manager;
    const repo = this.repo(manager);

    // 允许 methods 的 DB 约束兜底，这里做一次基本校验
    if (!Array.isArray(dto.methods) || dto.methods.length === 0) {
      throw new BadRequestError(`"methods" must be a non-empty string array`);
    }

    const key: ServiceRouteComposite = {
      serviceId: dto.serviceId,
      path: dto.path,
      routeRuleType: dto.routeRuleType ?? 'exact',
      rewrite: dto.routeRuleType,
    };

    // 即使 soft-deleted 也不允许重建同复合键
    const exists = await this.existsByComposite(key, { withDeleted: true, manager });
    if (exists) {
      throw new BadRequestError(
        `ServiceRoute already exists for serviceId="${key.serviceId}", path="${key.path}", routeRuleType="${key.routeRuleType}", rewrite="${key.rewrite}"`
      );
    }

    const entity = repo.create({
      ...dto,
      // 显式写入规范化后的复合键字段
      serviceId: key.serviceId,
      path: key.path,
      routeRuleType: key.routeRuleType,
      rewrite: key.rewrite,
    });

    if (options?.createdBy) {
      entity.createdBy = options.createdBy;
      entity.updatedBy = options.createdBy;
    }

    return repo.save(entity);
  }

  /** reads / exists */
  async getById(
    id: string,
    options?: {
      withDeleted?: boolean;
      manager?: EntityManager;
      withRelations?: boolean | ServiceRouteRelationKeys[];
    }
  ): Promise<ServiceRoute | null> {
    const repo = this.repo(options?.manager);

    let findOptions: FindOneOptions<ServiceRoute> = {
      where: { id },
      withDeleted: !!options?.withDeleted,
    };

    if (options?.withRelations) {
      findOptions = this.mergeFindOptionsWithRelations(findOptions, options.withRelations);
    }

    // 锁机制：在事务内对该行加写锁，防止竞态
    if (options?.manager) {
      findOptions.lock = { mode: 'pessimistic_write' };
    }

    return repo.findOne(findOptions);
  }

  async getByComposite(
    composite: ServiceRouteComposite,
    options?: {
      withDeleted?: boolean;
      manager?: EntityManager;
      withRelations?: boolean | ServiceRouteRelationKeys[];
    }
  ): Promise<ServiceRoute | null> {
    const repo = this.repo(options?.manager);

    let findOptions: FindOneOptions<ServiceRoute> = {
      where: {
        serviceId: composite.serviceId,
        path: composite.path,
        routeRuleType: composite.routeRuleType,
        rewrite: composite.rewrite ?? undefined,
      },
      withDeleted: !!options?.withDeleted,
    };

    if (options?.withRelations) {
      findOptions = this.mergeFindOptionsWithRelations(findOptions, options.withRelations);
    }

    if (options?.manager) {
      findOptions.lock = { mode: 'pessimistic_write' };
    }

    return repo.findOne(findOptions);
  }

  async existsById(id: string, options?: { withDeleted?: boolean; manager?: EntityManager }) {
    const repo = this.repo(options?.manager);
    return repo.exists({ where: { id }, withDeleted: !!options?.withDeleted });
  }

  async existsByComposite(
    composite: ServiceRouteComposite,
    options?: { withDeleted?: boolean; manager?: EntityManager }
  ) {
    const repo = this.repo(options?.manager);
    return repo.exists({
      where: {
        serviceId: composite.serviceId,
        path: composite.path,
        routeRuleType: composite.routeRuleType,
        rewrite: composite.rewrite ?? undefined,
      },
      withDeleted: !!options?.withDeleted,
    });
  }

  /** list (pagination + search + filter) */
  async getPaginatedList(
    data: ServiceRouteListRequest,
    options?: { withDeleted?: boolean; manager?: EntityManager }
  ) {
    const { search, filters, serviceId } = data;
    const withDeleted = !!options?.withDeleted;

    return paginateWithOffset({
      repo: this.repo(options?.manager),
      pagination: data,
      modifyQueryBuilder: qb => {
        if (withDeleted) {
          qb.withDeleted();
        } else {
          qb.andWhere(`${col<ServiceRoute>('deletedAt')} IS NULL`);
        }

        if (search) {
          qb.andWhere(
            new Brackets(qb1 => {
              qb1
                .where(`${col<ServiceRoute>('serviceId')} ILIKE %:search%`)
                .orWhere(`${col<ServiceRoute>('path')} ILIKE %:search%`)
                .orWhere(`${col<ServiceRoute>('rewrite')} ILIKE %:search%`);
            })
          ).setParameter('search', search);
        }

        // 构造 filters 对象，包含 serviceId
        const structuredFilters: Record<string, any> = { ...(filters || {}) };
        if (serviceId) structuredFilters.serviceId = serviceId;

        // 典型过滤项示例：
        applyFilters(qb, structuredFilters, {
          byKey: {
            status: {
              active: new Brackets(qb1 => {
                qb1
                  .where(`${col<ServiceRoute>('isActive')} = true`)
                  .andWhere(`${col<ServiceRoute>('deletedAt')} IS NULL`);
              }),
              inactive: new Brackets(qb1 => {
                qb1
                  .where(`${col<ServiceRoute>('isActive')} = false`)
                  .andWhere(`${col<ServiceRoute>('deletedAt')} IS NULL`);
              }),
              deleted: new Brackets(qb1 => {
                qb1.where(`${col<ServiceRoute>('deletedAt')} IS NOT NULL`);
              }),
            },
            // service 动态过滤
            serviceId: (value: string | string[]) =>
              new Brackets(qb1 => {
                const values = Array.isArray(value) ? value : [value];
                qb1.andWhere(`${col<ServiceRoute>('serviceId')} = ANY(:svcIds)`, {
                  svcIds: values,
                });
              }),
          },
        });

        return qb;
      },
    });
  }

  /** update */
  async update(
    id: string,
    patch: ServiceRouteUpdateRequest,
    options?: { updatedBy?: string; withDeleted?: boolean; manager?: EntityManager }
  ) {
    let changed = false;

    const route = await this.getById(id, {
      withDeleted: options?.withDeleted,
      manager: options?.manager,
    });

    if (!route) {
      throw new NotFoundError(`ServiceRoute ${id} not found`);
    }

    // 校验 methods 非空（如传）
    if (patch.methods !== undefined) {
      if (!Array.isArray(patch.methods) || patch.methods.length === 0) {
        throw new BadRequestError(`"methods" must be a non-empty string array`);
      }
    }

    // 更新可变字段
    Object.entries(patch).forEach(([k, v]) => {
      if (v !== undefined && (route as any)[k] !== v) {
        (route as any)[k] = v as any;
        changed = true;
      }
    });

    if (!changed) {
      return route;
    }

    route.updatedAt = new Date();
    if (options?.updatedBy) {
      route.updatedBy = options.updatedBy;
    }

    const saved = await this.repo(options?.manager).save(route);
    return saved;
  }

  /** delete / restore */
  async softDelete(
    id: string,
    options?: {
      deletedBy?: string;
      manager?: EntityManager;
    }
  ) {
    const manager = options?.manager;
    const repo = this.repo(manager);
    const route = await this.getById(id, { withDeleted: true, manager });
    if (!route) {
      throw new NotFoundError(`ServiceRoute ${id} not found`);
    }
    if (route.deletedAt) {
      throw new ForbiddenError(`ServiceRoute ${id} has been deleted`);
    }

    route.deletedAt = new Date();
    route.deletedBy = options?.deletedBy ?? route.deletedBy;
    return repo.save(route);
  }

  async restore(id: string, options?: { restoredBy?: string; manager?: EntityManager }) {
    const manager = options?.manager;
    const repo = this.repo(manager);
    const route = await this.getById(id, { withDeleted: true, manager });
    if (!route) {
      throw new NotFoundError(`ServiceRoute ${id} not found`);
    }
    if (!route.deletedAt) {
      throw new ForbiddenError(`ServiceRoute ${id} has not been deleted`);
    }
    route.deletedAt = null;
    route.deletedBy = null;
    route.updatedBy = options?.restoredBy ?? route.updatedBy;

    return repo.save(route);
  }

  async hardDelete(
    id: string,
    options?: {
      deletedBy?: string;
      manager?: EntityManager;
    }
  ) {
    const manager = options?.manager;
    const repo = this.repo(manager);
    const route = await this.getById(id, { withDeleted: true, manager });
    if (!route) {
      throw new NotFoundError(`ServiceRoute ${id} not found`);
    }
    return repo.remove(route);
  }

  /** option list */
  async getOptionList(options?: { manager?: EntityManager }) {
    const repo = this.repo(options?.manager);
    return repo.find({
      where: { isActive: true },
      select: ['id', 'serviceId', 'path', 'methods'],
      order: { serviceId: 'ASC', path: 'ASC' },
    });
  }
}
