import { buildResourceKey, ResourceKeyParts } from '@frankjhub/shared-perm';
import { Brackets, DataSource, EntityManager, FindOneOptions } from 'typeorm';
import { Resource } from './entities/Resource';
import {
  Qualifier,
  ResourceCreateRequest,
  ResourceListPageData,
  ResourceListRequest,
  ResourceUpdateRequest,
} from '@frankjhub/shared-schema';
import { BadRequestError, ForbiddenError, NotFoundError } from '@frankjhub/shared-errors';
import { paginateWithOffset } from '../common/utils/paginateWithOffset';
import { col } from '@frankjhub/shared-typeorm-utils';
import { applyFilters } from '../common/utils/applyFilters';

type ResourceRelationKeys = 'service';

export class ResourceRepository {
  constructor(private dataSource: DataSource) {}

  private repo(manager?: EntityManager) {
    return (manager ?? this.dataSource.manager).getRepository(Resource);
  }

  /** helpers */
  private makeKey(parts: ResourceKeyParts) {
    return buildResourceKey(parts);
  }

  private mergeFindOptionsWithRelations(
    findOptions: FindOneOptions<Resource>,
    withRelations?: boolean | ResourceRelationKeys[]
  ): FindOneOptions<Resource> {
    const mergedOptions = { ...findOptions };

    if (withRelations) {
      if (withRelations === true) {
        // 默认加载所有关系
        mergedOptions.relations = { service: true };
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
    resource: ResourceCreateRequest,
    options?: {
      createdBy?: string;
      manager?: EntityManager;
    }
  ) {
    const manager = options?.manager;
    const repo = this.repo(manager);

    // 统一构建key
    const key = this.makeKey({
      namespace: resource.namespace,
      entity: resource.entity,
      qualifier: resource.qualifier ?? undefined,
    });

    // 即使soft-deleted也不允许重名/重建
    const exists = await this.existsByKey(key, { withDeleted: true, manager });
    if (exists) {
      throw new BadRequestError(`Resource "${key}" already exists`);
    }

    const entity = repo.create({
      ...resource,
      resource_key: key,
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
      withRelations?: boolean | ResourceRelationKeys[];
    }
  ): Promise<Resource | null> {
    const repo = this.repo(options?.manager);

    let findOptions: FindOneOptions<Resource> = {
      where: { id },
      withDeleted: !!options?.withDeleted,
    };

    if (options?.withRelations) {
      findOptions = this.mergeFindOptionsWithRelations(findOptions, options.withRelations);
    }

    // 锁机制
    if (options?.manager) {
      findOptions.lock = { mode: 'pessimistic_write' };
    }
    return repo.findOne(findOptions);
  }

  async getByKey(
    key: string,
    options?: {
      withDeleted?: boolean;
      manager?: EntityManager;
      withRelations?: boolean | ResourceRelationKeys[];
    }
  ): Promise<Resource | null> {
    const repo = this.repo(options?.manager);

    let findOptions: FindOneOptions<Resource> = {
      where: { resource_key: key },
      withDeleted: !!options?.withDeleted,
    };

    if (options?.withRelations) {
      findOptions = this.mergeFindOptionsWithRelations(findOptions, options.withRelations);
    }

    // 锁机制
    if (options?.manager) {
      findOptions.lock = { mode: 'pessimistic_write' };
    }
    return repo.findOne(findOptions);
  }

  async getByTriple(
    triple: { namespace: string; entity: string; qualifier?: Qualifier },
    options?: {
      withDeleted?: boolean;
      manager?: EntityManager;
      withRelations?: boolean | ResourceRelationKeys[];
    }
  ): Promise<Resource | null> {
    const { namespace, entity } = triple;
    const qualifier = triple.qualifier ?? '*';
    const key = this.makeKey({ namespace, entity, qualifier });
    return this.getByKey(key, options);
  }

  async existsById(id: string, options?: { withDeleted?: boolean; manager?: EntityManager }) {
    const repo = this.repo(options?.manager);
    return repo.exists({ where: { id }, withDeleted: !!options?.withDeleted });
  }

  async existsByKey(key: string, options?: { withDeleted?: boolean; manager?: EntityManager }) {
    const repo = this.repo(options?.manager);
    return repo.exists({ where: { resource_key: key }, withDeleted: !!options?.withDeleted });
  }

  async existsByTriple(
    triple: { namespace: string; entity: string; qualifier?: Qualifier },
    options?: { withDeleted?: boolean; manager?: EntityManager }
  ) {
    const { namespace, entity } = triple;
    const qualifier = triple.qualifier ?? '*';
    const key = this.makeKey({ namespace, entity, qualifier });
    return this.existsByKey(key, options);
  }

  /** list (pagination + search + filter) */
  async getPaginatedList(
    data: ResourceListRequest,
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
          qb.andWhere(`${col<Resource>('deletedAt')} IS NULL`);
        }

        if (search) {
          qb.andWhere(
            new Brackets(qb1 => {
              qb1
                .where(`${col<Resource>('namespace')} ILIKE :search`)
                .orWhere(`${col<Resource>('entity')} ILIKE :search`)
                .orWhere(`${col<Resource>('resource_key')} ILIKE :search`);
            })
          ).setParameter('search', search);
        }

        applyFilters(qb, filters, {
          byKey: {
            status: {
              active: new Brackets(qb1 => {
                qb1
                  .where(`${col<Resource>('isActive')} = true`)
                  .andWhere(`${col<Resource>('deletedAt')} IS NULL`);
              }),
              inactive: new Brackets(qb1 => {
                qb1
                  .where(`${col<Resource>('isActive')} = false`)
                  .andWhere(`${col<Resource>('deletedAt')} IS NULL`);
              }),
              deleted: new Brackets(qb1 => {
                qb1.where(`${col<Resource>('deletedAt')} IS NOT NULL`);
              }),
            },
          },
        });

        return qb;
      },
    });
  }

  /** update */
  async update(
    id: string,
    patch: ResourceUpdateRequest,
    options?: { updatedBy?: string; withDeleted?: boolean; manager?: EntityManager }
  ) {
    let changed = false;

    const resource = await this.getById(id, {
      withDeleted: options?.withDeleted,
      manager: options?.manager,
    });

    if (!resource) {
      throw new NotFoundError(`Resource ${id} not found`);
    }

    // 设计中，三元组一旦创建，不能更改

    // 更新其它字段（不包含三元组与 key）
    Object.entries(patch).forEach(([k, v]) => {
      if (['namespace', 'entity', 'qualifier', 'key'].includes(k)) return;
      if (v !== undefined && (resource as any)[k] !== v) {
        (resource as any)[k] = v as any;
        changed = true;
      }
    });

    if (!changed) {
      return resource;
    }

    resource.updatedAt = new Date();
    if (options?.updatedBy) {
      resource.updatedBy = options.updatedBy;
    }

    const saved = await this.repo(options?.manager).save(resource);
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
    const resource = await this.getById(id, { withDeleted: true, manager });
    if (!resource) {
      throw new NotFoundError(`Resource ${id} not found`);
    }
    if (resource.deletedAt) {
      return new ForbiddenError(`Resource ${id} has been deleted`);
    }

    resource.deletedAt = new Date();
    resource.deletedBy = options?.deletedBy ?? resource.deletedBy;
    return repo.save(resource);
  }

  async restore(id: string, options?: { restoredBy?: string; manager?: EntityManager }) {
    const manager = options?.manager;
    const repo = this.repo(manager);
    const resource = await this.getById(id, { withDeleted: true, manager });
    if (!resource) {
      throw new NotFoundError(`Resource ${id} not found`);
    }
    if (!resource.deletedAt) {
      throw new ForbiddenError(`Resource ${id} has not been deleted`);
    }
    resource.deletedAt = null;
    resource.deletedBy = null;
    resource.updatedBy = options?.restoredBy ?? resource.updatedBy;

    return repo.save(resource);
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
    const resource = await this.getById(id, { withDeleted: true, manager });
    if (!resource) {
      throw new NotFoundError(`Resource ${id} not found`);
    }
    return repo.remove(resource);
  }

  /** option list */
  async getOptionList(options?: { manager?: EntityManager }) {
    const repo = this.repo(options?.manager);
    return repo.find({
      where: { isActive: true },
      select: ['id', 'resource_key'],
      order: { resource_key: 'ASC' },
    });
  }
}
