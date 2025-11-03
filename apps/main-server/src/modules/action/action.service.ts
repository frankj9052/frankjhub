import {
  ActionCreateRequest,
  ActionDetail,
  ActionDetailResponse,
  ActionListRequest,
  ActionListResponse,
  ActionOptionListResponse,
  ActionRef,
  ActionSummary,
  ActionUpdateRequest,
  SimpleResponse,
} from '@frankjhub/shared-schema';
import AppDataSource from '../../config/data-source';
import { createLoggerWithContext } from '../common/libs/logger';
import { Action } from './entities/Action';
import { NotFoundError } from '../common/errors/NotFoundError';
import { ActionRepository } from './action.repository';

const logger = createLoggerWithContext('ActionService');

export class ActionService {
  private actionRepo = new ActionRepository(AppDataSource);

  buildActionRef({ id, name, displayName }: Action): ActionRef {
    return { id, name, displayName };
  }

  buildActionSummary({
    id,
    name,
    displayName,
    isSystem,
    sortOrder,
    isActive,
    deletedAt,
    createdAt,
  }: Action): ActionSummary {
    return {
      id,
      name,
      displayName,
      isSystem,
      sortOrder,
      isActive,
      deletedAt: deletedAt?.toISOString(),
      createdAt: createdAt?.toISOString(),
    };
  }

  buildActionDetail(action: Action): ActionDetail {
    return {
      ...action,
      createdAt: action.createdAt.toISOString(),
      updatedAt: action.updatedAt.toISOString(),
      deletedAt: action.deletedAt?.toISOString(),
    };
  }

  async createAction(data: ActionCreateRequest, createdBy: string): Promise<SimpleResponse> {
    const { name } = data;
    const log = logger.child({ method: 'createAction', name });

    await this.actionRepo.create(data, { createdBy });

    log.info(`Created action "${name}" by "${createdBy}"`);
    const result: SimpleResponse = {
      status: 'success',
      message: `Created action "${name}"`,
    };
    return result;
  }

  async getActionList(pagination: ActionListRequest): Promise<ActionListResponse> {
    const result = await this.actionRepo.getPaginatedList(pagination, { withDeleted: true });
    const response: ActionListResponse = {
      status: 'success',
      message: 'Get action list successful',
      data: {
        ...result,
        data: result.data.map(action => this.buildActionSummary(action)),
      },
    };
    return response;
  }

  async getActionById(id: string): Promise<ActionDetailResponse> {
    const action = await this.actionRepo.getById(id, { withDeleted: true });
    if (!action) {
      throw new NotFoundError(`Action ${id} not found`);
    }
    const result: ActionDetailResponse = {
      status: 'success',
      message: 'Get action success',
      data: this.buildActionDetail(action),
    };
    return result;
  }

  async updateAction(
    id: string,
    update: ActionUpdateRequest,
    updatedBy: string
  ): Promise<SimpleResponse> {
    const log = logger.child({ method: 'updateAction', id, updatedBy });
    // transaction management
    const result = await AppDataSource.transaction(async manager => {
      // 更新字段
      const result = await this.actionRepo.update(id, update, {
        updatedBy,
        withDeleted: true,
        manager,
      });

      // 无需同步更改权限名称，已经使用了Postgres触发器
      // TODO: 之后如果触发器不好用，这里可以手动update: scope, permission, route-resource-action的action name
      // 活用 manager 和 promise all (多个数据更改)
      // if (result.nameChanged) {
      //   // 更新其它表的逻辑
      // }

      log.info(`Action ${result.data.name} updated By ${updatedBy}`);
      return result.data;
    });

    return {
      status: 'success',
      message: `Action ${result.name} updated by ${updatedBy}`,
    };
  }

  async softDeleteAction(id: string, deletedBy: string): Promise<SimpleResponse> {
    const result = await this.actionRepo.softDelete(id, { deletedBy });
    return {
      status: 'success',
      message: `Action ${result.name} deleted by ${deletedBy}`,
    };
  }

  async restoreAction(id: string, restoredBy: string): Promise<SimpleResponse> {
    const action = await this.actionRepo.restore(id, { restoredBy });

    return {
      status: 'success',
      message: `Action ${action.name} restored by ${restoredBy}`,
    };
  }

  async hardDeleteAction(id: string, deletedBy: string): Promise<SimpleResponse> {
    const action = await this.actionRepo.hardDelete(id, { deletedBy });
    return {
      status: 'success',
      message: `Action ${action.name} permanently deleted`,
    };
  }

  async getActionOptions(): Promise<ActionOptionListResponse> {
    const actions = await this.actionRepo.getOptionList();

    return {
      status: 'success',
      message: 'Fetched action options successful',
      data: actions.map(action => this.buildActionRef(action)),
    };
  }
}
