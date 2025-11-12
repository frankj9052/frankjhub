import { BadRequestError, ForbiddenError, NotFoundError } from '@frankjhub/shared-errors';
import {
  HttpMethod,
  ServiceCreateRequest,
  ServiceListRequest,
  ServiceSnapshot,
  ServiceUpdateRequest,
} from '@frankjhub/shared-schema';
import { Brackets, DataSource, EntityManager, FindOneOptions } from 'typeorm';
import { Service } from './entities/Service';
import { paginateWithOffset } from '../common/utils/paginateWithOffset';
import { col } from '@frankjhub/shared-typeorm-utils';
import { applyFilters } from '../common/utils/applyFilters';

type ServiceRelationKeys = 'resources' | 'routes';

export class ServiceRepository {
  constructor(private dataSource: DataSource) {}

  private repo(manager?: EntityManager) {
    return (manager ?? this.dataSource.manager).getRepository(Service);
  }

  /** 合并关系加载配置 */
  private mergeFindOptionsWithRelations(
    findOptions: FindOneOptions<Service>,
    withRelations?: boolean | ServiceRelationKeys[]
  ): FindOneOptions<Service> {
    const mergedOptions = { ...findOptions };

    if (withRelations) {
      if (withRelations === true) {
        mergedOptions.relations = { resources: true, routes: true };
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
    data: ServiceCreateRequest,
    options?: {
      createdBy?: string;
      manager?: EntityManager;
    }
  ) {
    const manager = options?.manager;

    // serviceId 唯一性校验（包含软删记录）
    const exist = await this.existsByServiceId(data.serviceId, { withDeleted: true, manager });
    if (exist) {
      throw new BadRequestError(`Service "${data.serviceId}" already exists`);
    }

    const repo = this.repo(manager);
    const entity = repo.create(data);
    if (options?.createdBy) {
      entity.createdBy = options.createdBy;
      entity.updatedBy = options.createdBy;
    }
    return repo.save(entity);
  }

  /** reads */
  async getById(
    id: string,
    options?: {
      withDeleted?: boolean;
      manager?: EntityManager;
      withRelations?: boolean | ServiceRelationKeys[];
    }
  ): Promise<Service | null> {
    const repo = this.repo(options?.manager);

    let findOptions: FindOneOptions<Service> = {
      where: { id },
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

  async getByServiceId(
    serviceId: string,
    options?: {
      withDeleted?: boolean;
      manager?: EntityManager;
      withRelations?: boolean | ServiceRelationKeys[];
    }
  ): Promise<Service | null> {
    const repo = this.repo(options?.manager);

    let findOptions: FindOneOptions<Service> = {
      where: { serviceId },
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

  /** exists */
  async existsById(id: string, options?: { withDeleted?: boolean; manager?: EntityManager }) {
    const repo = this.repo(options?.manager);
    return repo.exists({ where: { id }, withDeleted: !!options?.withDeleted });
  }

  async existsByServiceId(
    serviceId: string,
    options?: { withDeleted?: boolean; manager?: EntityManager }
  ) {
    const repo = this.repo(options?.manager);
    return repo.exists({ where: { serviceId }, withDeleted: !!options?.withDeleted });
  }

  /** list (pagination + search + filter) */
  async getPaginatedList(
    data: ServiceListRequest,
    options?: { withDeleted?: boolean; manager?: EntityManager }
  ) {
    const { search, filters } = data;
    const withDeleted = !!options?.withDeleted;

    return paginateWithOffset({
      repo: this.repo(options?.manager),
      pagination: data,
      modifyQueryBuilder: qb => {
        if (withDeleted) {
          qb.withDeleted();
        } else {
          qb.andWhere(`${col<Service>('deletedAt')} IS NULL`);
        }

        if (search) {
          qb.andWhere(
            new Brackets(qb1 => {
              qb1
                .where(`${col<Service>('serviceId')} ILIKE :search`)
                .orWhere(`${col<Service>('name')} ILIKE :search`)
                .orWhere(`${col<Service>('baseUrl')} ILIKE :search`)
                .orWhere(`${col<Service>('ownerTeam')} ILIKE :search`);
            })
          ).setParameter('search', search);
        }

        // 与 resource.repository.ts 一致的状态过滤；可按需扩展更多业务过滤项
        applyFilters(qb, filters, {
          byKey: {
            status: {
              active: new Brackets(qb1 => {
                qb1
                  .where(`${col<Service>('isActive')} = true`)
                  .andWhere(`${col<Service>('deletedAt')} IS NULL`);
              }),
              inactive: new Brackets(qb1 => {
                qb1
                  .where(`${col<Service>('isActive')} = false`)
                  .andWhere(`${col<Service>('deletedAt')} IS NULL`);
              }),
              deleted: new Brackets(qb1 => {
                qb1.where(`${col<Service>('deletedAt')} IS NOT NULL`);
              }),
            },
          },
        });

        return qb;
      },
    });
  }

  async getSnapshots(options?: { manager?: EntityManager }): Promise<ServiceSnapshot> {
    const manager = options?.manager;
    const repo = this.repo(manager);
    const services = await repo.find({
      where: { isActive: true, routes: { isActive: true } },
      relations: {
        routes: {
          scopes: true,
        },
      },
    });
    const snapshot: ServiceSnapshot = services.map(s => ({
      key: s.serviceId,
      aud: `${s.audPrefix}${s.serviceId}`,
      baseUrl: s.baseUrl,
      requiredScopes: s.baselineRequiredScopes ?? [],
      routes: s?.routes?.map(r => ({
        path: r.path,
        authMode: r.authMode,
        routeRuleType: r.routeRuleType,
        methods: r.methods as HttpMethod[],
        scopeKeys: r.scopes ? r.scopes.flatMap(s => s.scopeKey) : [],
        rewrite: r.rewrite,
        rateLimit: r.rateLimit,
      })),
    }));
    return snapshot;
  }

  /** update */
  async update(
    id: string,
    patch: ServiceUpdateRequest,
    options?: { updatedBy?: string; withDeleted?: boolean; manager?: EntityManager }
  ) {
    let changed = false;

    const svc = await this.getById(id, {
      withDeleted: options?.withDeleted,
      manager: options?.manager,
    });

    if (!svc) {
      throw new NotFoundError(`Service ${id} not found`);
    }

    // 禁止修改自然键 serviceId
    // 如果前端误传，直接忽略
    const { serviceId: _ignoreServiceId, ...rest } = patch as any;

    // 如果更新了 serviceSecret，则自动进行版本 +1 与轮转时间
    if (rest.serviceSecret !== undefined && rest.serviceSecret !== null) {
      if (rest.serviceSecret !== '') {
        (svc as any).serviceSecret = rest.serviceSecret;
        svc.secretVersion = (svc.secretVersion ?? 1) + 1;
        svc.lastRotatedAt = new Date();
        changed = true;
      } else {
        // 空串不处理，避免把密钥清空
        delete (rest as any).serviceSecret;
      }
    }

    // 其余字段常规更新
    Object.entries(rest).forEach(([k, v]) => {
      if (v === undefined) return;
      if ((svc as any)[k] !== v) {
        (svc as any)[k] = v as any;
        changed = true;
      }
    });

    if (!changed) {
      return svc;
    }

    svc.updatedAt = new Date();
    if (options?.updatedBy) {
      svc.updatedBy = options.updatedBy;
    }

    // 实体层会对 serviceSecret 做哈希
    return this.repo(options?.manager).save(svc);
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
    const svc = await this.getById(id, { withDeleted: true, manager });
    if (!svc) {
      throw new NotFoundError(`Service ${id} not found`);
    }
    if (svc.deletedAt) {
      throw new ForbiddenError(`Service ${id} has been deleted`);
    }

    svc.deletedAt = new Date();
    svc.deletedBy = options?.deletedBy ?? svc.deletedBy;
    return repo.save(svc);
  }

  async restore(id: string, options?: { restoredBy?: string; manager?: EntityManager }) {
    const manager = options?.manager;
    const repo = this.repo(manager);
    const svc = await this.getById(id, { withDeleted: true, manager });
    if (!svc) {
      throw new NotFoundError(`Service ${id} not found`);
    }
    if (!svc.deletedAt) {
      throw new ForbiddenError(`Service ${id} has not been deleted`);
    }
    svc.deletedAt = null;
    svc.deletedBy = null;
    svc.updatedBy = options?.restoredBy ?? svc.updatedBy;

    return repo.save(svc);
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
    const svc = await this.getById(id, { withDeleted: true, manager });
    if (!svc) {
      throw new NotFoundError(`Service ${id} not found`);
    }
    return repo.remove(svc);
  }

  /** option list */
  async getOptionList(options?: { manager?: EntityManager }) {
    const repo = this.repo(options?.manager);
    return repo.find({
      where: { isActive: true },
      select: ['id', 'serviceId'],
      order: { serviceId: 'ASC' },
    });
  }
}
