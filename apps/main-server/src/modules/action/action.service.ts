import {
  ActionCreateRequest,
  ActionDto,
  ActionListRequest,
  ActionListResponse,
  ActionOptionListResponse,
  ActionSingleResponse,
  ActionUpdateRequest,
} from '@frankjhub/shared-schema';
import AppDataSource from '../../config/data-source';
import { createLoggerWithContext } from '../common/libs/logger';
import { Action } from './entities/Action';
import { BadRequestError } from '../common/errors/BadRequestError';
import { paginateWithOffset } from '../common/utils/paginateWithOffset';
import { NotFoundError } from '../common/errors/NotFoundError';
import { Permission } from '../permission/entities/Permission';
import { updateEntityFields } from '@frankjhub/shared-utils';

const logger = createLoggerWithContext('ActionService');

const filterConditionMap: Record<string, string> = {
  active: `(t."is_active" = true AND t."deleted_at" IS NULL)`,
  inactive: `(t."is_active" = false AND t."deleted_at" IS NULL)`,
  deleted: `(t."deleted_at" IS NOT NULL)`,
};

export class ActionService {
  private actionRepo = AppDataSource.getRepository(Action);

  buildAction(action: Action): ActionDto {
    return {
      id: action.id,
      name: action.name,
      description: action.description ?? '',
      isActive: action.isActive,
      createdAt: action.createdAt.toISOString(),
      updatedAt: action.updatedAt.toISOString(),
      deletedAt: action.deletedAt?.toISOString() ?? null,
      createdBy: action.createdBy ?? null,
      updatedBy: action.updatedBy ?? null,
      deletedBy: action.deletedBy ?? null,
    };
  }

  async createAction(data: ActionCreateRequest, createdBy: string): Promise<ActionSingleResponse> {
    const { name, description } = data;
    const log = logger.child({ method: 'createAction', name });

    const existing = await this.actionRepo.findOne({ where: { name } });
    if (existing) {
      throw new BadRequestError(`Action "${name}" already exists`);
    }

    const newAction = this.actionRepo.create({
      name,
      description: description ?? undefined,
      createdBy,
    });
    const savedAction = await this.actionRepo.save(newAction);

    log.info(`Created action "${name}" by "${createdBy}"`);
    const result: ActionSingleResponse = {
      status: 'success',
      message: `Created action "${name}"`,
      data: this.buildAction(savedAction),
    };
    return result;
  }

  async getActionList(pagination: ActionListRequest): Promise<ActionListResponse> {
    const result = await paginateWithOffset({
      repo: this.actionRepo,
      pagination,
      modifyQueryBuilder: qb => {
        const { search, filters } = pagination;
        if (search) {
          qb.where('t.name ILIKE :search OR t.description ILIKE :search', {
            search: `%${search.trim()}%`,
          });
        }
        if (filters?.length) {
          const validConditions = filters.map(status => filterConditionMap[status]).filter(Boolean);
          if (validConditions.length > 0) {
            qb.andWhere(`(${validConditions.join(' OR ')})`);
          }
        }
        return qb.withDeleted();
      },
    });
    const response: ActionListResponse = {
      status: 'success',
      message: 'Get action list successful',
      data: {
        ...result,
        data: result.data.map(action => this.buildAction(action)),
      },
    };
    return response;
  }

  async getActionById(id: string): Promise<ActionSingleResponse> {
    const action = await this.actionRepo.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!action) {
      throw new NotFoundError(`Action ${id} not found`);
    }
    const result: ActionSingleResponse = {
      status: 'success',
      message: 'Get action success',
      data: this.buildAction(action),
    };
    return result;
  }

  async updateAction(
    update: ActionUpdateRequest,
    performedBy: string
  ): Promise<ActionSingleResponse> {
    const log = logger.child({ method: 'updateAction', id: update.id, performedBy });
    const { id } = update;

    const allowedFields: (keyof ActionDto)[] = [
      'createdAt',
      'createdBy',
      'deletedAt',
      'deletedBy',
      'description',
      'isActive',
      'name',
      'updatedAt',
      'updatedBy',
    ];

    // transaction management
    await AppDataSource.transaction(async manager => {
      const actionRepo = manager.getRepository(Action);
      const permissionRepo = manager.getRepository(Permission);

      const action = await actionRepo.findOne({ where: { id }, withDeleted: true });
      if (!action) {
        throw new NotFoundError(`Action ${id} not found`);
      }

      // 判断name是否被更改
      const nameChanged = update.name !== action.name;

      // 更新字段
      updateEntityFields(action, update, allowedFields);
      action.updatedBy = performedBy;
      action.updatedAt = new Date();

      const savedAction = await actionRepo.save(action);

      // 同步更改权限名称
      if (nameChanged) {
        const permissions = await permissionRepo.find({
          where: {
            permissionActions: {
              action: {
                id,
              },
            },
          },
          relations: {
            resource: true,
            permissionActions: {
              action: true,
              permission: true,
            },
          },
          withDeleted: true,
        });

        await Promise.all(
          permissions.map(async permission => {
            permission.setName();

            // 不要 save，使用 update 避免联级保存失败
            await permissionRepo.update(permission.id, {
              name: permission.name,
            });
          })
        );
      }

      log.info(`Resource ${savedAction.name} updated By ${performedBy}`);
    });

    const updated = await this.actionRepo.findOneOrFail({ where: { id }, withDeleted: true });
    const result: ActionSingleResponse = {
      status: 'success',
      message: `Action ${updated.name} updated by ${performedBy}`,
      data: this.buildAction(updated),
    };
    return result;
  }

  async softDeleteAction(id: string, performedBy: string): Promise<ActionSingleResponse> {
    const action = await this.actionRepo.findOne({ where: { id } });
    if (!action) {
      throw new NotFoundError(`Action ${id} not found`);
    }

    action.deletedAt = new Date();
    action.deletedBy = performedBy;

    const savedAction = await this.actionRepo.save(action);

    const result: ActionSingleResponse = {
      status: 'success',
      message: `Action ${action.name} deleted by ${performedBy}`,
      data: this.buildAction(savedAction),
    };
    return result;
  }

  async restoreAction(id: string, performedBy: string): Promise<ActionSingleResponse> {
    const action = await this.actionRepo.findOne({ where: { id }, withDeleted: true });
    if (!action) {
      throw new NotFoundError(`Action ${id} not found`);
    }

    if (!action.deletedAt) {
      return {
        status: 'success',
        message: `Action ${action.name} is not deleted`,
        data: this.buildAction(action),
      };
    }

    action.deletedAt = null;
    action.deletedBy = null;
    action.updatedBy = performedBy;

    const savedAction = await this.actionRepo.save(action);

    return {
      status: 'success',
      message: `Action ${savedAction.name} restored by ${performedBy}`,
      data: this.buildAction(savedAction),
    };
  }

  async hardDeleteAction(id: string): Promise<ActionSingleResponse> {
    const action = await this.actionRepo.findOne({ where: { id }, withDeleted: true });
    if (!action) {
      throw new NotFoundError(`Action ${id} not found`);
    }

    await this.actionRepo.remove(action);

    return {
      status: 'success',
      message: `Action ${action.name} permanently deleted`,
      data: this.buildAction(action),
    };
  }

  async getActionOptions(): Promise<ActionOptionListResponse> {
    const actions = await this.actionRepo.find({
      where: { isActive: true },
      select: ['id', 'name'],
      order: { name: 'ASC' },
    });

    return {
      status: 'success',
      message: 'Fetched action options successful',
      data: actions.map(action => ({
        id: action.id,
        name: action.name,
      })),
    };
  }
}
