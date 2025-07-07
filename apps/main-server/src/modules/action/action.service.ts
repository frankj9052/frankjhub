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
      description: action.description ?? null,
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

    log.info(`Created action "${name}"`);
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
    const response = {
      ...result,
      data: result.data.map(action => this.buildAction(action)),
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
    const { id } = update;
    const action = await this.actionRepo.findOne({ where: { id }, withDeleted: true });
    if (!action) {
      throw new NotFoundError(`Action ${id} not found`);
    }

    for (const [key, value] of Object.entries(update)) {
      if (key === 'id') continue;
      if (value !== undefined) {
        if (key === 'orgType') {
          (action as any)[key] = { id: value };
        } else {
          (action as any)[key] = value;
        }
      }
    }

    action.updatedBy = performedBy;
    const savedAction = await this.actionRepo.save(action);
    const result: ActionSingleResponse = {
      status: 'success',
      message: `Action ${savedAction.name} updated by ${performedBy}`,
      data: this.buildAction(savedAction),
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
      message: 'Fetched action options successfully',
      data: actions.map(action => ({
        id: action.id,
        name: action.name,
      })),
    };
  }
}
