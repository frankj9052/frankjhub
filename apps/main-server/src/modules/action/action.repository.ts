import { Brackets, DataSource, EntityManager, FindOneOptions } from 'typeorm';
import { Action } from './entities/Action';
import {
  ActionCreateRequest,
  ActionListRequest,
  ActionUpdateRequest,
} from '@frankjhub/shared-schema';
import { paginateWithOffset } from '../common/utils/paginateWithOffset';
import { applyFilters } from '../common/utils/applyFilters';
import { col } from '@frankjhub/shared-typeorm-utils';
import { BadRequestError, ForbiddenError, NotFoundError } from '@frankjhub/shared-errors';

export class ActionRepository {
  constructor(private dataSource: DataSource) {}

  private repo(manager?: EntityManager) {
    return (manager ?? this.dataSource.manager).getRepository(Action);
  }

  async create(
    action: ActionCreateRequest,
    options?: {
      createdBy?: string;
      manager?: EntityManager;
    }
  ) {
    const manager = options?.manager;
    const exist = await this.existsByName(action.name, { withDeleted: true, manager });
    if (exist) {
      throw new BadRequestError(`Action "${name}" already exists`);
    }
    const repo = this.repo(manager);
    const entity = repo.create(action);
    if (options?.createdBy) {
      entity.createdBy = options.createdBy;
      entity.updatedBy = options.createdBy;
    }
    return repo.save(entity);
  }

  async getById(
    id: string,
    options?: { withDeleted?: boolean; manager?: EntityManager }
  ): Promise<Action | null> {
    const repo = this.repo(options?.manager);
    const findOptions: FindOneOptions<Action> = {
      where: { id },
      withDeleted: !!options?.withDeleted,
    };
    if (options?.manager) {
      findOptions.lock = { mode: 'pessimistic_write' };
    }
    return repo.findOne(findOptions);
  }

  async existsByName(name: string, options?: { withDeleted?: boolean; manager?: EntityManager }) {
    const repo = this.repo(options?.manager);
    return repo.exists({ where: { name }, withDeleted: !!options?.withDeleted });
  }

  async existsById(id: string, options?: { withDeleted?: boolean; manager?: EntityManager }) {
    const repo = this.repo(options?.manager);
    return repo.exists({ where: { id }, withDeleted: !!options?.withDeleted });
  }

  async getPaginatedList(
    data: ActionListRequest,
    options?: {
      withDeleted?: boolean;
      manager?: EntityManager;
    }
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
          qb.andWhere(`${col<Action>('deletedAt')} IS NULL`);
        }
        if (search) {
          qb.andWhere(
            new Brackets(qb1 => {
              qb1
                .where(`${col<Action>('name')} ILIKE :search`)
                .orWhere(`${col<Action>('displayName')} ILIKE :search`)
                .orWhere(
                  `EXISTS (SELECT 1 FROM unnest(${col<Action>('aliases')}) a WHERE a ILIKE :search)`
                );
            })
          ).setParameter('search', search);
        }

        // 过滤
        applyFilters(qb, filters, {
          byKey: {
            status: {
              active: new Brackets(qb1 => {
                qb1
                  .where(`${col<Action>('isActive')} = true`)
                  .andWhere(`${col<Action>('deletedAt')} IS NULL`);
              }),
              inactive: new Brackets(qb1 => {
                qb1
                  .where(`${col<Action>('isActive')} = false`)
                  .andWhere(`${col<Action>('deletedAt')} IS NULL`);
              }),
              deleted: new Brackets(qb1 => {
                qb1.where(`${col<Action>('deletedAt')} IS NOT NULL`);
              }),
            },
            system: {
              all: new Brackets(qb1 => {
                qb1
                  .where(`${col<Action>('isSystem')} = true`)
                  .orWhere(`${col<Action>('isSystem')} = false`);
              }),
              system: new Brackets(qb1 => {
                qb1.where(`${col<Action>('isSystem')} = true`);
              }),
              non_system: new Brackets(qb1 => {
                qb1.where(`${col<Action>('isSystem')} = false`);
              }),
            },
          },
        });

        return qb;
      },
    });
  }

  async update(
    id: string,
    update: ActionUpdateRequest,
    options?: { updatedBy?: string; withDeleted?: boolean; manager?: EntityManager }
  ) {
    let changed = false;
    let nameChanged = false;

    // 查找目标实体
    const action = await this.getById(id, {
      withDeleted: options?.withDeleted,
      manager: options?.manager,
    });

    if (!action) {
      throw new NotFoundError(`Action ${id} not found`);
    }

    if (action.isSystem) {
      throw new ForbiddenError(
        `Action "${action.name}" is a system-defined action and cannot be modified`
      );
    }

    // 检查 name 是否变化
    if (update.name && update.name !== action.name) {
      nameChanged = true;

      // 初始化 aliases 数组
      if (!Array.isArray(action.aliases)) {
        action.aliases = [];
      }

      // 把旧名字加入 aliases，去重
      if (!action.aliases.includes(action.name)) {
        action.aliases.push(action.name);
      }

      action.name = update.name;
      changed = true;
    }

    // 更新其它字段（不包含 name）
    Object.entries(update).forEach(([key, value]) => {
      if (key === 'name') return; // name 已处理
      if (value !== undefined && (action as any)[key] !== value) {
        (action as any)[key] = value;
        changed = true;
      }
    });

    if (!changed) {
      return {
        nameChanged,
        data: action,
      };
    }
    action.updatedAt = new Date();
    if (options?.updatedBy) {
      action.updatedBy = options.updatedBy;
    }

    const saved = await this.repo(options?.manager).save(action);

    return {
      data: saved,
      nameChanged,
    };
  }

  async softDelete(
    id: string,
    options?: {
      deletedBy?: string;
      manager?: EntityManager;
    }
  ) {
    const manager = options?.manager;
    const repo = this.repo(manager);
    const action = await this.getById(id, { withDeleted: true, manager });
    if (!action) {
      throw new NotFoundError(`Action ${id} not found`);
    }
    if (action.deletedAt) {
      return new ForbiddenError(`Action ${id} has been deleted`);
    }

    action.deletedAt = new Date();
    action.deletedBy = options?.deletedBy ?? action.deletedBy;
    return repo.save(action);
  }

  async restore(id: string, options?: { restoredBy?: string; manager?: EntityManager }) {
    const manager = options?.manager;
    const repo = this.repo(manager);
    const action = await this.getById(id, { withDeleted: true, manager });
    if (!action) {
      throw new NotFoundError(`Action ${id} not found`);
    }
    if (!action.deletedAt) {
      throw new ForbiddenError(`Action ${id} has not been deleted`);
    }
    action.deletedAt = null;
    action.deletedBy = null;
    action.updatedBy = options?.restoredBy ?? action.updatedBy;

    return repo.save(action);
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
    const action = await this.getById(id, { withDeleted: true, manager });
    if (!action) {
      throw new NotFoundError(`Action ${id} not found`);
    }
    return repo.remove(action);
  }

  async getOptionList(options?: { manager?: EntityManager }) {
    const manager = options?.manager;
    const repo = this.repo(manager);
    return repo.find({
      where: { isActive: true },
      select: ['id', 'name', 'displayName'],
      order: { name: 'ASC' },
    });
  }
}
