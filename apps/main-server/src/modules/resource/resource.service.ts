import {
  ResourceCreateRequest,
  ResourceDto,
  ResourceListRequest,
  ResourceListResponse,
  ResourceOptionListResponse,
  ResourceSingleResponse,
  ResourceUpdateRequest,
} from '@frankjhub/shared-schema';
import AppDataSource from '../../config/data-source';
import { createLoggerWithContext } from '../common/libs/logger';
import { Resource } from './entities/Resource';
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

export class ResourceService {
  private resourceRepo = AppDataSource.getRepository(Resource);

  buildResource(resource: Resource): ResourceDto {
    return {
      id: resource.id,
      name: resource.name,
      description: resource.description ?? '',
      isActive: resource.isActive,
      createdAt: resource.createdAt.toISOString(),
      updatedAt: resource.updatedAt.toISOString(),
      deletedAt: resource.deletedAt?.toISOString() ?? null,
      createdBy: resource.createdBy ?? null,
      updatedBy: resource.updatedBy ?? null,
      deletedBy: resource.deletedBy ?? null,
    };
  }

  async createResource(
    data: ResourceCreateRequest,
    createdBy: string
  ): Promise<ResourceSingleResponse> {
    const { name, description } = data;
    const log = logger.child({ method: 'createResource', name });

    const existing = await this.resourceRepo.findOne({ where: { name } });
    if (existing) {
      throw new BadRequestError(`Resource "${name}" already exists`);
    }

    const newResource = this.resourceRepo.create({
      name,
      description: description ?? undefined,
      createdBy,
    });
    const savedResource = await this.resourceRepo.save(newResource);

    log.info(`Created resource "${name}" by "${createdBy}"`);
    const result: ResourceSingleResponse = {
      status: 'success',
      message: `Created resource "${name}" by "${createdBy}"`,
      data: this.buildResource(savedResource),
    };
    return result;
  }

  async getResourceList(pagination: ResourceListRequest): Promise<ResourceListResponse> {
    const result = await paginateWithOffset({
      repo: this.resourceRepo,
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

    const response: ResourceListResponse = {
      status: 'success',
      message: 'Get resource list successful',
      data: {
        ...result,
        data: result.data.map(action => this.buildResource(action)),
      },
    };
    return response;
  }

  async getResourceById(id: string): Promise<ResourceSingleResponse> {
    const resource = await this.resourceRepo.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!resource) {
      throw new NotFoundError(`Resource ${id} not found`);
    }

    const result: ResourceSingleResponse = {
      status: 'success',
      message: 'Get resource success',
      data: this.buildResource(resource),
    };
    return result;
  }

  async updateResource(
    update: ResourceUpdateRequest,
    performedBy: string
  ): Promise<ResourceSingleResponse> {
    const log = logger.child({ method: 'updateResource', id: update.id, performedBy });
    const { id } = update;

    const allowedFields: (keyof ResourceDto)[] = [
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

    // 事务处理 Transaction Management
    await AppDataSource.transaction(async manager => {
      const resourceRepo = manager.getRepository(Resource);
      const permissionRepo = manager.getRepository(Permission);

      const resource = await resourceRepo.findOne({ where: { id }, withDeleted: true });
      if (!resource) {
        throw new NotFoundError(`Resource ${id} not found`);
      }

      // 判断name是否被更改
      const nameChanged = update.name !== resource.name;

      // 更新字段
      updateEntityFields(resource, update, allowedFields);
      resource.updatedBy = performedBy;
      resource.updatedAt = new Date();

      const savedResource = await resourceRepo.save(resource);

      // 同步更新权限名称
      if (nameChanged) {
        const permissions = await permissionRepo.find({
          where: { resource: { id } },
          relations: {
            resource: true,
            permissionActions: { action: true },
          },
          withDeleted: true,
        });

        await Promise.all(
          permissions.map(async permission => {
            permission.setName();
            await permissionRepo.save(permission);
          })
        );
      }

      log.info(`Resource ${savedResource.name} updated By ${performedBy}`);
    });

    const updated = await this.resourceRepo.findOneOrFail({ where: { id }, withDeleted: true });
    const result: ResourceSingleResponse = {
      status: 'success',
      message: `Resource ${updated.name} updated By ${performedBy}`,
      data: this.buildResource(updated),
    };
    return result;
  }

  async softDeleteResource(id: string, performedBy: string): Promise<ResourceSingleResponse> {
    const log = logger.child({ method: 'softDeleteResource', id, performedBy });
    const resource = await this.resourceRepo.findOne({ where: { id } });
    if (!resource) {
      throw new NotFoundError(`Resource ${id} not found`);
    }

    resource.deletedAt = new Date();
    resource.deletedBy = performedBy;

    const savedResource = await this.resourceRepo.save(resource);

    log.info(`Resource ${resource.name} deleted by ${performedBy}`);
    const result: ResourceSingleResponse = {
      status: 'success',
      message: `Resource ${resource.name} deleted by ${performedBy}`,
      data: this.buildResource(savedResource),
    };
    return result;
  }

  async restoreResource(id: string, performedBy: string): Promise<ResourceSingleResponse> {
    const log = logger.child({ method: 'restoreResource', id, performedBy });
    const resource = await this.resourceRepo.findOne({ where: { id }, withDeleted: true });
    if (!resource) {
      throw new NotFoundError(`Resource ${id} not found`);
    }

    resource.deletedAt = null;
    resource.deletedBy = null;
    resource.updatedBy = performedBy;

    const savedResource = await this.resourceRepo.save(resource);
    log.info(`Resource ${savedResource.name} restored by ${performedBy}`);

    return {
      status: 'success',
      message: `Resource ${savedResource.name} restored By ${performedBy}`,
      data: this.buildResource(savedResource),
    };
  }

  async hardDeleteResource(id: string, performedBy: string): Promise<ResourceSingleResponse> {
    const log = logger.child({ method: 'hardDeleteResource', id, performedBy });
    const resource = await this.resourceRepo.findOne({ where: { id }, withDeleted: true });
    if (!resource) {
      throw new NotFoundError(`Resource ${id} not found`);
    }

    await this.resourceRepo.remove(resource);
    log.info(`Resource ${resource.name} permantly deleted by ${performedBy}`);
    return {
      status: 'success',
      message: `Resource ${resource.name} permantly deleted by ${performedBy}`,
      data: this.buildResource(resource),
    };
  }

  async getResourceOptionList(): Promise<ResourceOptionListResponse> {
    const resources = await this.resourceRepo.find({
      where: { isActive: true },
      select: ['id', 'name'],
      order: { name: 'ASC' },
    });

    return {
      status: 'success',
      message: 'Fetched resource option list successful',
      data: resources.map(resource => ({
        id: resource.id,
        name: resource.name,
      })),
    };
  }
}
