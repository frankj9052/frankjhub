import { Brackets, DataSource, EntityManager, FindOneOptions } from 'typeorm';
import { RolePermission } from './entities/RolePermission';
import {
  RolePermissionCreateRequest,
  RolePermissionListRequest,
  RolePermissionUpdateRequest,
} from '@frankjhub/shared-schema';
import { BadRequestError, ForbiddenError, NotFoundError } from '@frankjhub/shared-errors';
import { paginateWithOffset } from '../common/utils/paginateWithOffset';
import { col } from '@frankjhub/shared-typeorm-utils';
import { applyFilters } from '../common/utils/applyFilters';

type RolePermissionRelationKeys = 'role' | 'permission';

/** 复合键定义 */
type RolePermissionComposite = {
  roleId: string;
  permissionId: string;
};

export class RolePermissionRepository {
  constructor(private dataSource: DataSource) {}

  private repo(manager?: EntityManager) {
    return (manager ?? this.dataSource.manager).getRepository(RolePermission);
  }

  private mergeFindOptionsWithRelations(
    findOptions: FindOneOptions<RolePermission>,
    withRelations?: boolean | RolePermissionRelationKeys[]
  ): FindOneOptions<RolePermission> {
    const mergedOptions = { ...findOptions };
    if (withRelations) {
      if (withRelations === true) {
        mergedOptions.relations = { role: true, permission: true };
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

  /** ---------- create ---------- */
  async create(
    dto: RolePermissionCreateRequest,
    options?: {
      createdBy?: string;
      manager?: EntityManager;
    }
  ) {
    const manager = options?.manager;
    const repo = this.repo(manager);

    const key: RolePermissionComposite = {
      roleId: dto.roleId,
      permissionId: dto.permissionId,
    };

    // 即使 soft-deleted 也不允许重建同复合键
    const exists = await this.existsByComposite(key, { withDeleted: true, manager });
    if (exists) {
      throw new BadRequestError(
        `RolePermission already exists for roleId="${key.roleId}" & permissionId="${key.permissionId}"`
      );
    }

    const entity = repo.create({
      roleId: key.roleId,
      permissionId: key.permissionId,
      isActive: dto.isActive ?? true,
    });

    if (options?.createdBy) {
      entity.createdBy = options.createdBy;
      entity.updatedBy = options.createdBy;
    }

    // 注意：RolePermission 实体中通过 @BeforeInsert/@BeforeUpdate 会基于已加载的关系设置 name。
    // 这里直接 save，若需确保 setName 运行时有关系，可在 service 层进行预加载后再传入实体。
    return repo.save(entity);
  }

  /** ---------- reads / exists ---------- */
  async getById(
    id: string,
    options?: {
      withDeleted?: boolean;
      manager?: EntityManager;
      withRelations?: boolean | RolePermissionRelationKeys[];
    }
  ): Promise<RolePermission | null> {
    const repo = this.repo(options?.manager);

    let findOptions: FindOneOptions<RolePermission> = {
      where: { id },
      withDeleted: !!options?.withDeleted,
    };

    if (options?.withRelations) {
      findOptions = this.mergeFindOptionsWithRelations(findOptions, options.withRelations);
    }

    // 在事务内对该行加写锁，防止竞态
    if (options?.manager) {
      findOptions.lock = { mode: 'pessimistic_write' };
    }

    return repo.findOne(findOptions);
  }

  async getByComposite(
    composite: RolePermissionComposite,
    options?: {
      withDeleted?: boolean;
      manager?: EntityManager;
      withRelations?: boolean | RolePermissionRelationKeys[];
    }
  ): Promise<RolePermission | null> {
    const repo = this.repo(options?.manager);

    let findOptions: FindOneOptions<RolePermission> = {
      where: {
        roleId: composite.roleId,
        permissionId: composite.permissionId,
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
    composite: RolePermissionComposite,
    options?: { withDeleted?: boolean; manager?: EntityManager }
  ) {
    const repo = this.repo(options?.manager);
    return repo.exists({
      where: {
        roleId: composite.roleId,
        permissionId: composite.permissionId,
      },
      withDeleted: !!options?.withDeleted,
    });
  }

  /** ---------- list (pagination + search + filter) ---------- */
  async getPaginatedList(
    data: RolePermissionListRequest,
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
          qb.andWhere(`${col<RolePermission>('deletedAt')} IS NULL`);
        }

        /** 搜索策略：
         * - 按 name（roleCode:permissionName）模糊
         * - 按 roleId / permissionId 模糊
         */
        if (search) {
          qb.andWhere(
            new Brackets(qb1 => {
              qb1
                .where(`${col<RolePermission>('name')} ILIKE %:search%`)
                .orWhere(`${col<RolePermission>('roleId')} ILIKE %:search%`)
                .orWhere(`${col<RolePermission>('permissionId')} ILIKE %:search%`);
            })
          ).setParameter('search', search);
        }

        applyFilters(qb, filters, {
          byKey: {
            status: {
              active: new Brackets(qb1 => {
                qb1
                  .where(`${col<RolePermission>('isActive')} = true`)
                  .andWhere(`${col<RolePermission>('deletedAt')} IS NULL`);
              }),
              inactive: new Brackets(qb1 => {
                qb1
                  .where(`${col<RolePermission>('isActive')} = false`)
                  .andWhere(`${col<RolePermission>('deletedAt')} IS NULL`);
              }),
              deleted: new Brackets(qb1 => {
                qb1.where(`${col<RolePermission>('deletedAt')} IS NOT NULL`);
              }),
            },
          },
        });

        return qb;
      },
    });
  }

  /** ---------- update ---------- */
  async update(
    id: string,
    patch: RolePermissionUpdateRequest & Partial<RolePermissionCreateRequest>,
    options?: { updatedBy?: string; withDeleted?: boolean; manager?: EntityManager }
  ) {
    const rolePerm = await this.getById(id, {
      withDeleted: options?.withDeleted,
      manager: options?.manager,
      withRelations: true, // 让实体生命周期钩子可以拿到关系以更新 name
    });

    if (!rolePerm) {
      throw new NotFoundError(`RolePermission ${id} not found`);
    }

    let changed = false;

    if (patch.isActive !== undefined && patch.isActive !== rolePerm.isActive) {
      rolePerm.isActive = patch.isActive;
      changed = true;
    }

    if (!changed) {
      return rolePerm;
    }

    rolePerm.updatedAt = new Date();
    if (options?.updatedBy) {
      rolePerm.updatedBy = options.updatedBy;
    }

    const saved = await this.repo(options?.manager).save(rolePerm);
    return saved;
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
    if (!entity) {
      throw new NotFoundError(`RolePermission ${id} not found`);
    }
    if (entity.deletedAt) {
      throw new ForbiddenError(`RolePermission ${id} has been deleted`);
    }

    entity.deletedAt = new Date();
    entity.deletedBy = options?.deletedBy ?? entity.deletedBy;
    return repo.save(entity);
  }

  async restore(id: string, options?: { restoredBy?: string; manager?: EntityManager }) {
    const manager = options?.manager;
    const repo = this.repo(manager);
    const entity = await this.getById(id, { withDeleted: true, manager });
    if (!entity) {
      throw new NotFoundError(`RolePermission ${id} not found`);
    }
    if (!entity.deletedAt) {
      throw new ForbiddenError(`RolePermission ${id} has not been deleted`);
    }

    entity.deletedAt = null;
    entity.deletedBy = null;
    entity.updatedBy = options?.restoredBy ?? entity.updatedBy;

    return repo.save(entity);
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
    const entity = await this.getById(id, { withDeleted: true, manager });
    if (!entity) {
      throw new NotFoundError(`RolePermission ${id} not found`);
    }
    return repo.remove(entity);
  }

  /** ---------- option list ---------- */
  // TODO finish option-list after create rolePermissionRef schema
  async getOptionList(options?: { manager?: EntityManager }) {
    const repo = this.repo(options?.manager);
    return repo.find({
      where: { isActive: true },
      select: ['id', 'roleId', 'permissionId', 'name'],
      order: { roleId: 'ASC', permissionId: 'ASC' },
    });
  }
}
