import {
  PermissionCreateRequest,
  PermissionDto,
  PermissionListRequest,
  PermissionListResponse,
  PermissionOptionListResponse,
  PermissionSingleResponse,
  PermissionUpdateRequest,
} from '@frankjhub/shared-schema';
import AppDataSource from '../../config/data-source';
import { Action } from '../action/entities/Action';
import { Resource } from '../resource/entities/Resource';
import { Permission } from './entities/Permission';
import { PermissionAction } from './entities/PermissionAction';
import { logger } from '../common/libs/logger';
import { NotFoundError } from '../common/errors/NotFoundError';
import { DeepPartial, In } from 'typeorm';
import { BadRequestError } from '../common/errors/BadRequestError';
import { buildPermissionName } from '../codecs/permissionCodec';
import { paginateWithOffset } from '../common/utils/paginateWithOffset';

const filterConditionMap: Record<string, string> = {
  active: `(t."is_active" = true AND t."deleted_at" IS NULL)`,
  inactive: `(t."is_active" = false AND t."deleted_at" IS NULL)`,
  deleted: `(t."deleted_at" IS NOT NULL)`,
};

export class PermissionService {
  private permissionRepo = AppDataSource.getRepository(Permission);
  private resourceRepo = AppDataSource.getRepository(Resource);
  private actionRepo = AppDataSource.getRepository(Action);
  private permissionActionRepo = AppDataSource.getRepository(PermissionAction);

  buildPermission(permission: Permission): PermissionDto {
    return {
      id: permission.id,
      name: permission.name,
      description: permission.description ?? null,
      fields: permission.fields ?? null,
      condition: permission.condition ?? null,
      isActive: permission.isActive,
      createdAt: permission.createdAt.toISOString(),
      updatedAt: permission.updatedAt.toISOString(),
      deletedAt: permission.deletedAt?.toISOString() ?? null,
      createdBy: permission.createdBy ?? null,
      updatedBy: permission.updatedBy ?? null,
      deletedBy: permission.deletedBy ?? null,
      resource: {
        id: permission.resource.id,
        name: permission.resource.name,
        description: permission.resource.description,
        isActive: permission.resource.isActive,
        createdAt: permission.resource.createdAt.toISOString(),
        createdBy: permission.resource.createdBy ?? null,
        updatedAt: permission.resource.updatedAt.toISOString(),
        updatedBy: permission.resource.updatedBy ?? null,
        deletedAt: permission.resource.deletedAt?.toISOString() ?? null,
        deletedBy: permission.resource.deletedBy ?? null,
      },
      permissionActions: permission.permissionActions.map(pa => ({
        id: pa.id,
        isActive: pa.isActive,
        createdAt: pa.createdAt.toISOString(),
        createdBy: pa.createdBy ?? null,
        updatedAt: pa.updatedAt.toISOString(),
        updatedBy: pa.updatedBy ?? null,
        deletedAt: pa.deletedAt?.toISOString() ?? null,
        deletedBy: pa.deletedBy ?? null,
        permission: { id: permission.id },
        action: {
          id: pa.action.id,
          name: pa.action.name,
          description: pa.action.description,
          isActive: pa.action.isActive,
          createdAt: pa.action.createdAt.toISOString(),
          createdBy: pa.action.createdBy ?? null,
          updatedAt: pa.action.updatedAt.toISOString(),
          updatedBy: pa.action.updatedBy ?? null,
          deletedAt: pa.action.deletedAt?.toISOString() ?? null,
          deletedBy: pa.action.deletedBy ?? null,
        },
      })),
    };
  }

  async createPermission(
    data: PermissionCreateRequest,
    createdBy: string
  ): Promise<PermissionSingleResponse> {
    const { resourceId, actionIds, fields, condition, description } = data;
    const log = logger.child({ method: 'createPermission', resourceId, createdBy });

    const resource = await this.resourceRepo.findOne({
      where: {
        id: resourceId,
        isActive: true,
      },
    });

    if (!resource) throw new NotFoundError('Resource not found');

    const actions = await this.actionRepo.find({
      where: {
        id: In(actionIds),
        isActive: true,
      },
    });

    if (actions.length !== actionIds.length)
      throw new BadRequestError('One or more actions not found');

    const name = buildPermissionName(
      resource.name,
      actions.map(a => a.name),
      fields ?? undefined,
      condition ?? undefined
    );

    const existing = await this.permissionRepo.findOne({ where: { name } });
    if (existing) throw new BadRequestError(`Permission "${name}" already exists`);

    const permissionData: DeepPartial<Permission> = {
      resource,
      fields: fields ?? undefined,
      condition: condition ?? undefined,
      description: description ?? undefined,
      createdBy,
      name,
    };

    const permission = this.permissionRepo.create(permissionData);

    const savedPermission = await this.permissionRepo.save(permission);

    const permissionActions = actions.map(action =>
      this.permissionActionRepo.create({
        permission: savedPermission,
        action,
        createdBy,
      })
    );

    await this.permissionActionRepo.save(permissionActions);

    // 加载 resource 和 permissionActions 用于返回
    const loaded = await this.permissionRepo.findOneOrFail({
      where: { id: savedPermission.id },
      relations: {
        resource: true,
        permissionActions: {
          action: true,
        },
      },
    });

    log.info(`Permission "${savedPermission.name}" created by ${createdBy} successfully`);
    return {
      status: 'success',
      message: 'Permission created successfully',
      data: this.buildPermission(loaded),
    };
  }

  async getPermissionList(pagination: PermissionListRequest): Promise<PermissionListResponse> {
    const result = await paginateWithOffset({
      repo: this.permissionRepo,
      pagination,
      modifyQueryBuilder: qb => {
        const { search, filters } = pagination;
        // 搜索条件
        if (search) {
          qb.where('t.name ILIKE :search OR t.description ILIKE :search', {
            search: `%${search.trim()}%`,
          });
        }

        // 状态过滤（active / inactive / deleted）
        if (filters?.length) {
          const validConditions = filters.map(status => filterConditionMap[status]).filter(Boolean);
          if (validConditions.length > 0) {
            qb.andWhere(`(${validConditions.join(' OR ')})`);
          }
        }
        return qb
          .leftJoinAndSelect('t.resource', 'resource')
          .leftJoinAndSelect(`t.permissionActions`, 'permissionActions')
          .leftJoinAndSelect('permissionActions.action', 'action')
          .withDeleted();
      },
    });

    return {
      status: 'success',
      message: 'Get permission list successful',
      data: {
        ...result,
        data: result.data.map(this.buildPermission),
      },
    };
  }

  async getPermissionById(id: string): Promise<PermissionSingleResponse> {
    const permission = await this.permissionRepo.findOne({
      where: { id },
      relations: {
        resource: true,
        permissionActions: {
          action: true,
        },
      },
      withDeleted: true,
    });

    if (!permission) {
      throw new NotFoundError('Permission not found');
    }

    return {
      status: 'success',
      message: 'Get permission detail successful',
      data: this.buildPermission(permission),
    };
  }

  async updatePermission(
    data: PermissionUpdateRequest,
    updatedBy: string
  ): Promise<PermissionSingleResponse> {
    const log = logger.child({ method: 'updatePermission', id: data.id, updatedBy });
    const { id, resourceId, actionIds, fields, condition, description, isActive } = data;

    const permission = await this.permissionRepo.findOne({
      where: { id },
      relations: {
        resource: true,
        permissionActions: {
          action: true,
        },
      },
    });

    if (!permission) {
      throw new NotFoundError('Permission not found');
    }

    // 处理 resource 更新（如果有）
    if (resourceId && resourceId !== permission.resource.id) {
      const newResource = await this.resourceRepo.findOneByOrFail({ id: resourceId });
      permission.resource = newResource;
    }

    // 处理 actions 更新（如果有）
    let actions = permission.permissionActions.map(pa => pa.action);
    let actionsChanged = false;

    if (actionIds) {
      const newActions = await this.actionRepo.findBy({ id: In(actionIds) });
      if (newActions.length !== actionIds.length) {
        throw new BadRequestError('One or more actions not found');
      }

      // 判断是否真的变更了 actionIds
      const oldIds = new Set(actions.map(a => a.id));
      const newIds = new Set(newActions.map(a => a.id));
      actionsChanged = oldIds.size !== newIds.size || [...oldIds].some(id => !newIds.has(id));

      actions = newActions;
    }

    // 赋值更新字段
    permission.fields = fields ?? permission.fields;
    permission.condition = condition ?? permission.condition;
    permission.description = description ?? permission.description;
    permission.isActive = typeof isActive === 'boolean' ? isActive : permission.isActive;
    permission.updatedBy = updatedBy;

    // 先保存 permission 本体（触发 @BeforeUpdate，但此时 actions 还未更新）
    await this.permissionRepo.save(permission);

    // 如果 actions 变了，更新关联表, 在保存 permission 后做
    if (actionsChanged) {
      await this.permissionActionRepo.delete({ permission: { id: permission.id } });
      const permissionActions = actions.map(action =>
        this.permissionActionRepo.create({
          permission,
          action,
          createdBy: updatedBy,
        })
      );
      await this.permissionActionRepo.save(permissionActions);
    }

    const reloaded = await this.permissionRepo.findOneOrFail({
      where: { id: permission.id },
      relations: {
        resource: true,
        permissionActions: {
          action: true,
        },
      },
    });
    reloaded.setName();
    await this.permissionRepo.save(reloaded);

    // 重新加载关联数据
    const loaded = await this.permissionRepo.findOneOrFail({
      where: { id: permission.id },
      relations: {
        resource: true,
        permissionActions: {
          action: true,
        },
      },
    });
    log.debug('Checking loaded', { name: loaded.name });

    log.info(`Permission "${permission.name}" updated by "${updatedBy}" successfully`);
    return {
      status: 'success',
      message: 'Permission updated successfully',
      data: this.buildPermission(loaded),
    };
  }

  async softDeletePermission(id: string, performedBy: string): Promise<PermissionSingleResponse> {
    const permission = await this.permissionRepo.findOne({
      where: { id },
      relations: {
        resource: true,
        permissionActions: {
          action: true,
        },
      },
    });

    if (!permission) {
      throw new NotFoundError('Permission not found');
    }

    permission.deletedAt = new Date();
    permission.deletedBy = performedBy;
    permission.updatedBy = performedBy;

    const saved = await this.permissionRepo.save(permission);

    return {
      status: 'success',
      message: `Permission "${saved.name}" has been soft-deleted`,
      data: this.buildPermission(saved),
    };
  }

  async restorePermission(id: string, performedBy: string): Promise<PermissionSingleResponse> {
    const permission = await this.permissionRepo.findOne({
      where: { id },
      relations: {
        resource: true,
        permissionActions: {
          action: true,
        },
      },
      withDeleted: true,
    });

    if (!permission) {
      throw new NotFoundError('Permission not found');
    }

    // 如果未被删除，直接返回
    if (!permission.deletedAt) {
      return {
        status: 'success',
        message: 'Permission is already active',
        data: this.buildPermission(permission),
      };
    }

    // 恢复字段处理
    permission.deletedAt = null;
    permission.deletedBy = null;
    permission.updatedBy = performedBy;

    const saved = await this.permissionRepo.save(permission);

    return {
      status: 'success',
      message: `Permission "${saved.name}" has been restored`,
      data: this.buildPermission(saved),
    };
  }

  async hardDeletePermission(id: string): Promise<PermissionSingleResponse> {
    const permission = await this.permissionRepo.findOne({
      where: { id },
      relations: {
        resource: true,
        permissionActions: {
          action: true,
        },
      },
      withDeleted: true,
    });

    if (!permission) {
      throw new NotFoundError('Permission notF found');
    }

    // 先删除关联的 PermissionAction
    await this.permissionActionRepo.delete({ permission: { id } });

    // 再永久删除 permission 本体
    await this.permissionRepo.remove(permission);

    return {
      status: 'success',
      message: `Permission "${permission.name}" has been permanently deleted`,
      data: this.buildPermission(permission),
    };
  }

  async getPermissionOptionList(): Promise<PermissionOptionListResponse> {
    const permissions = await this.permissionRepo.find({
      select: ['id', 'name'],
      order: {
        name: 'ASC',
      },
    });

    return {
      status: 'success',
      message: 'Get permission options successful',
      data: permissions.map(p => ({
        id: p.id,
        name: p.name,
      })),
    };
  }
}
