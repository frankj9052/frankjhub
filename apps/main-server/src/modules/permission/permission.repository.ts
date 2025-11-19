import { Brackets, DataSource, EntityManager, FindOneOptions, Not } from 'typeorm';
import { Permission } from './entities/Permission';
import { Resource } from '../resource/entities/Resource';
import { Action } from '../action/entities/Action';
import {
  PERMISSION_EFFECT,
  PermissionCreateRequest,
  PermissionEffect,
  PermissionListRequest,
  PermissionUpdateRequest,
} from '@frankjhub/shared-schema';
import { arrayToString, safeJsonStringify } from '@frankjhub/shared-utils';
import { BadRequestError, ForbiddenError, NotFoundError } from '@frankjhub/shared-errors';
import { paginateWithOffset } from '../common/utils/paginateWithOffset';
import { col } from '@frankjhub/shared-typeorm-utils';
import { applyFilters } from '../common/utils/applyFilters';

type PermissionRelationKeys = 'resource' | 'action';

/** 与数据库复合唯一键一致的组合键 */
export type PermissionComposite = {
  resource_key: string;
  actionName: string;
  fieldsHash: string;
  conditionHash: string;
  effect: PermissionEffect;
};

export class PermissionRepository {
  constructor(private dataSource: DataSource) {}

  private repo(manager?: EntityManager) {
    return (manager ?? this.dataSource.manager).getRepository(Permission);
  }

  private resourceRepo(manager?: EntityManager) {
    return (manager ?? this.dataSource.manager).getRepository(Resource);
  }

  private actionRepo(manager?: EntityManager) {
    return (manager ?? this.dataSource.manager).getRepository(Action);
  }

  private mergeFindOptionsWithRelations(
    findOptions: FindOneOptions<Permission>,
    withRelations?: boolean | PermissionRelationKeys[]
  ): FindOneOptions<Permission> {
    const mergedOptions = { ...findOptions };

    if (withRelations) {
      if (withRelations === true) {
        mergedOptions.relations = { resource: true, action: true };
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

  /** ---------- helpers ---------- */

  /** 以实体钩子相同规则预计算 hashes，用于唯一性检查 */
  private computeCompositeFromInput(input: {
    resource_key: string;
    actionName: string;
    fields?: string[];
    condition?: Record<string, unknown> | null;
    effect?: PermissionEffect;
  }): PermissionComposite {
    const fieldsHash = arrayToString(input.fields);
    const conditionHash = safeJsonStringify(input.condition ?? undefined);
    return {
      resource_key: input.resource_key,
      actionName: input.actionName,
      fieldsHash,
      conditionHash,
      effect: input.effect ?? PERMISSION_EFFECT.ALLOW,
    };
  }

  /** ---------- create ---------- */
  async create(
    dto: PermissionCreateRequest,
    options?: {
      createdBy?: string;
      manager?: EntityManager;
    }
  ) {
    const manager = options?.manager;
    const repo = this.repo(manager);

    // 基础校验
    if (!dto.resource_key) throw new BadRequestError('"resource_key" is required');
    if (!dto.actionName) throw new BadRequestError('"actionName" is required');

    // 加载 Resource / Action（确保实体钩子能生成 name / actionName）
    const [resource, action] = await Promise.all([
      this.resourceRepo(manager).findOne({ where: { resource_key: dto.resource_key } }),
      this.actionRepo(manager).findOne({ where: { name: dto.actionName } }),
    ]);
    if (!resource) throw new NotFoundError(`Resource Key ${dto.resource_key} not found`);
    if (!action) throw new NotFoundError(`Action Name ${dto.actionName} not found`);

    // 预计算复合唯一键（与实体钩子一致）
    const key = this.computeCompositeFromInput({
      resource_key: dto.resource_key,
      actionName: dto.actionName,
      fields: dto.fields,
      condition: (dto as any).condition ?? undefined,
      effect: dto.effect ?? PERMISSION_EFFECT.ALLOW,
    });

    // 即使 soft-deleted 也不允许重建相同复合键
    const exists = await this.existsByComposite(key, { withDeleted: true, manager });
    if (exists) {
      throw new BadRequestError(
        `Permission already exists (resource_key="${key.resource_key}", actionName="${key.actionName}", fieldsHash="${key.fieldsHash}", conditionHash="${key.conditionHash}", effect="${key.effect}")`
      );
    }

    const entity = repo.create({
      ...dto,
      resource,
      resourceId: resource.id,
      action,
      actionId: action.id,
      condition: dto.condition ?? undefined,
    });

    if (options?.createdBy) {
      entity.createdBy = options.createdBy;
      entity.updatedBy = options.createdBy;
    }

    return repo.save(entity);
  }

  /** ---------- reads / exists ---------- */
  async getById(
    id: string,
    options?: {
      withDeleted?: boolean;
      manager?: EntityManager;
      withRelations?: boolean | PermissionRelationKeys[];
    }
  ): Promise<Permission | null> {
    const repo = this.repo(options?.manager);

    let findOptions: FindOneOptions<Permission> = {
      where: { id },
      withDeleted: !!options?.withDeleted,
    };

    if (options?.withRelations) {
      findOptions = this.mergeFindOptionsWithRelations(findOptions, options.withRelations);
    }

    // 在事务内可加写锁避免竞态
    if (options?.manager) {
      findOptions.lock = { mode: 'pessimistic_write' };
    }

    return repo.findOne(findOptions);
  }

  async getByComposite(
    composite: PermissionComposite,
    options?: {
      withDeleted?: boolean;
      manager?: EntityManager;
      withRelations?: boolean | PermissionRelationKeys[];
    }
  ): Promise<Permission | null> {
    const repo = this.repo(options?.manager);

    let findOptions: FindOneOptions<Permission> = {
      where: {
        resource_key: composite.resource_key,
        actionName: composite.actionName,
        fieldsHash: composite.fieldsHash,
        conditionHash: composite.conditionHash,
        effect: composite.effect,
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
    composite: PermissionComposite,
    options?: { withDeleted?: boolean; manager?: EntityManager }
  ) {
    const repo = this.repo(options?.manager);
    return repo.exists({
      where: {
        resource_key: composite.resource_key,
        actionName: composite.actionName,
        fieldsHash: composite.fieldsHash,
        conditionHash: composite.conditionHash,
        effect: composite.effect,
      },
      withDeleted: !!options?.withDeleted,
    });
  }

  /** ---------- list (pagination + search + filter) ---------- */
  async getPaginatedList(
    data: PermissionListRequest,
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
          qb.andWhere(`${col<Permission>('deletedAt')} IS NULL`);
        }

        if (search) {
          qb.andWhere(
            new Brackets(qb1 => {
              qb1
                .where(`${col<Permission>('name')} ILIKE %:search%`)
                .orWhere(`${col<Permission>('actionName')} ILIKE %:search%`);
            })
          ).setParameter('search', search);
        }

        applyFilters(qb, filters ?? {}, {
          byKey: {
            status: {
              active: new Brackets(qb1 => {
                qb1
                  .where(`${col<Permission>('isActive')} = true`)
                  .andWhere(`${col<Permission>('deletedAt')} IS NULL`);
              }),
              inactive: new Brackets(qb1 => {
                qb1
                  .where(`${col<Permission>('isActive')} = false`)
                  .andWhere(`${col<Permission>('deletedAt')} IS NULL`);
              }),
              deleted: new Brackets(qb1 => {
                qb1.where(`${col<Permission>('deletedAt')} IS NOT NULL`);
              }),
            },
            effect: (value: PermissionEffect | PermissionEffect[]) =>
              new Brackets(qb1 => {
                const values = Array.isArray(value) ? value : [value];
                qb1.andWhere(`${col<Permission>('effect')} = ANY(:eff)`, { eff: values });
              }),
          },
        });

        return qb;
      },
    });
  }

  /** ---------- update ---------- */
  async update(
    id: string,
    patch: PermissionUpdateRequest,
    options?: { updatedBy?: string; withDeleted?: boolean; manager?: EntityManager }
  ) {
    const manager = options?.manager;
    const repo = this.repo(manager);

    const current = await this.getById(id, {
      withDeleted: options?.withDeleted,
      manager,
      withRelations: true,
    });
    if (!current) throw new NotFoundError(`Permission ${id} not found`);

    let changed = false;
    Object.entries(patch).forEach(([k, v]) => {
      if (v !== undefined && (current as any)[k] !== v) {
        (current as any)[k] = v as any;
        changed = true;
      }
    });

    if (!changed) {
      return current;
    }

    // 预计算潜在的复合唯一键冲突
    const composite = this.computeCompositeFromInput({
      resource_key: current.resource_key,
      actionName: current.actionName,
      fields: current.fields,
      condition: current.condition as any,
      effect: current.effect,
    });

    const conflict = await repo.exists({
      where: {
        id: Not(current.id),
        resource_key: composite.resource_key,
        actionName: composite.actionName,
        fieldsHash: composite.fieldsHash,
        conditionHash: composite.conditionHash,
        effect: composite.effect,
      },
      withDeleted: true,
    });
    if (conflict) {
      throw new BadRequestError(
        `Another Permission already exists with the same composite key (resource_key="${composite.resource_key}", actionName="${composite.actionName}", fieldsHash="${composite.fieldsHash}", conditionHash="${composite.conditionHash}", effect="${composite.effect}")`
      );
    }

    current.updatedAt = new Date();
    if (options?.updatedBy) current.updatedBy = options.updatedBy;

    // 保存（实体钩子会同步 actionName / fieldsHash / conditionHash / name）
    return repo.save(current);
  }

  /** ---------- delete / restore / hardDelete ---------- */
  async softDelete(
    id: string,
    options?: {
      deletedBy?: string;
      manager?: EntityManager;
    }
  ) {
    const manager = options?.manager;
    const repo = this.repo(manager);

    const entity = await this.getById(id, { withDeleted: true, manager });
    if (!entity) throw new NotFoundError(`Permission ${id} not found`);
    if (entity.deletedAt) throw new ForbiddenError(`Permission ${id} has been deleted`);

    entity.deletedAt = new Date();
    entity.deletedBy = options?.deletedBy ?? entity.deletedBy;
    return repo.save(entity);
  }

  async restore(id: string, options?: { restoredBy?: string; manager?: EntityManager }) {
    const manager = options?.manager;
    const repo = this.repo(manager);

    const entity = await this.getById(id, { withDeleted: true, manager });
    if (!entity) throw new NotFoundError(`Permission ${id} not found`);
    if (!entity.deletedAt) throw new ForbiddenError(`Permission ${id} has not been deleted`);

    entity.deletedAt = null;
    entity.deletedBy = null;
    entity.updatedBy = options?.restoredBy ?? entity.updatedBy;
    return repo.save(entity);
  }

  async hardDelete(
    id: string,
    options?: {
      deletedBy?: string; // 仅作审计用途，这里直接 remove
      manager?: EntityManager;
    }
  ) {
    const manager = options?.manager;
    const repo = this.repo(manager);

    const entity = await this.getById(id, { withDeleted: true, manager });
    if (!entity) throw new NotFoundError(`Permission ${id} not found`);
    return repo.remove(entity);
  }

  /** ---------- option list ---------- */
  // TODO finish here after create permissionRef schema
  async getOptionList(options?: { manager?: EntityManager }) {
    const repo = this.repo(options?.manager);
    return repo.find({
      where: { isActive: true },
      select: ['id', 'name', 'resourceId', 'actionId', 'actionName', 'effect'],
      order: { actionName: 'ASC', name: 'ASC' },
    });
  }
}
