import {
  ResourceCreateRequest,
  ResourceDetail,
  ResourceDetailResponse,
  ResourceDto,
  ResourceListRequest,
  ResourceListResponse,
  ResourceOptionListResponse,
  ResourceRef,
  ResourceSummary,
  ResourceUpdateRequest,
  SimpleResponse,
} from '@frankjhub/shared-schema';
import AppDataSource from '../../config/data-source';
import { createLoggerWithContext } from '../common/libs/logger';
import { Resource } from './entities/Resource';
import { BadRequestError } from '../common/errors/BadRequestError';
import { paginateWithOffset } from '../common/utils/paginateWithOffset';
import { NotFoundError } from '../common/errors/NotFoundError';
import { Permission } from '../permission/entities/Permission';
import { updateEntityFields } from '@frankjhub/shared-utils';
import { applyFilters } from '../common/utils/applyFilters';
import { ResourceRepository } from './resource.repository';

const logger = createLoggerWithContext('ActionService');

// const filterConditionMap: Record<string, string> = {
//   active: `(t."is_active" = true AND t."deleted_at" IS NULL)`,
//   inactive: `(t."is_active" = false AND t."deleted_at" IS NULL)`,
//   deleted: `(t."deleted_at" IS NOT NULL)`,
// };

export class ResourceService {
  private resourceRepo = new ResourceRepository(AppDataSource);

  buildResourceRef({ id, resource_key }: Resource): ResourceRef {
    return { id, resource_key };
  }

  buildResourceSummary({
    createdAt,
    id,
    namespace,
    entity,
    qualifier,
    fieldsMode,
    fields,
    isActive,
    resource_key,
    deletedAt,
  }: Resource): ResourceSummary {
    return {
      createdAt: createdAt?.toISOString(),
      id,
      namespace,
      entity,
      qualifier,
      fields,
      fieldsMode,
      isActive,
      resource_key,
      deletedAt: deletedAt?.toISOString(),
    };
  }

  buildResourceDetail(resource: Resource): ResourceDetail {
    return {
      ...resource,
      createdAt: resource.createdAt.toISOString(),
      updatedAt: resource.updatedAt.toISOString(),
      deletedAt: resource.deletedAt?.toISOString(),
      service: {
        createdAt: resource.service.createdAt.toISOString(),
        id: resource.service.id,
        name: resource.service.name,
        isActive: !!resource.service.isActive,
        serviceId: resource.service.serviceId,
        baseUrl: resource.service.baseUrl,
        ownerTeam: resource.service.ownerTeam,
        lastRotatedAt: resource.service.lastRotatedAt?.toISOString() ?? null,
        updatedAt: resource.service.updatedAt.toISOString(),
        deletedAt: resource.service.deletedAt?.toISOString(),
      },
    };
  }

  // 这里不再创建resource, 通过创建service快照和routes自动生成
  // async createResource(data: ResourceCreateRequest, createdBy: string): Promise<SimpleResponse> {
  //   const { name, description } = data;
  //   const log = logger.child({ method: 'createResource', name });

  //   const existing = await this.resourceRepo.findOne({ where: { name } });
  //   if (existing) {
  //     throw new BadRequestError(`Resource "${name}" already exists`);
  //   }

  //   const newResource = this.resourceRepo.create({
  //     name,
  //     description: description ?? undefined,
  //     createdBy,
  //   });
  //   const savedResource = await this.resourceRepo.save(newResource);

  //   log.info(`Created resource "${name}" by "${createdBy}"`);
  //   const result: ResourceSingleResponse = {
  //     status: 'success',
  //     message: `Created resource "${name}" by "${createdBy}"`,
  //     data: this.buildResource(savedResource),
  //   };
  //   return result;
  // }

  async getResourceList(pagination: ResourceListRequest): Promise<ResourceListResponse> {
    const result = await this.resourceRepo.getPaginatedList(pagination, { withDeleted: true });

    const response: ResourceListResponse = {
      status: 'success',
      message: 'Get resource list successful',
      data: {
        ...result,
        data: result.data.map(resource => this.buildResourceSummary(resource)),
      },
    };
    return response;
  }

  async getResourceById(id: string): Promise<ResourceDetailResponse> {
    const resource = await this.resourceRepo.getById(id, {
      withDeleted: true,
      withRelations: ['service'],
    });
    if (!resource) {
      throw new NotFoundError(`Resource ${id} not found`);
    }

    return {
      status: 'success',
      message: 'Get resource success',
      data: this.buildResourceDetail(resource),
    };
  }

  async updateResource(
    id: string,
    update: ResourceUpdateRequest,
    updatedBy: string
  ): Promise<SimpleResponse> {
    const log = logger.child({ method: 'updateResource', id, updatedBy });

    // 事务处理 Transaction Management
    const result = await AppDataSource.transaction(async manager => {
      const result = await this.resourceRepo.update(id, update, {
        updatedBy,
        withDeleted: true,
        manager,
      });

      // 如果有同步需要更新的内容放这里

      log.info(`Resource ${result.namespace} updated By ${updatedBy}`);
      return result;
    });
    return {
      status: 'success',
      message: `Resource ${result.namespace} updated By ${updatedBy}`,
    };
  }

  async softDeleteResource(id: string, deletedBy: string): Promise<SimpleResponse> {
    const log = logger.child({ method: 'softDeleteResource', id, deletedBy });
    await this.resourceRepo.softDelete(id, { deletedBy });
    log.info(`Resource ${id} deleted by ${deletedBy}`);
    return {
      status: 'success',
      message: `Resource ${id} deleted by ${deletedBy}`,
    };
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
