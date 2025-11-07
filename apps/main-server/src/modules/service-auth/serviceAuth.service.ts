import {
  HttpMethod,
  ResourceCreateRequest,
  ServiceCreateRequest,
  ServiceDetail,
  ServiceJwtPayload,
  ServiceListRequest,
  ServiceListResponse,
  ServiceLogin,
  ServiceLoginResponse,
  ServiceRef,
  ServiceSnapshot,
  ServiceSnapshotResponse,
  ServiceSummary,
  ServiceUpdateRequest,
  SimpleResponse,
} from '@frankjhub/shared-schema';
import AppDataSource from '../../config/data-source';
import { Service } from './entities/Service';
import * as argon2 from 'argon2';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';
import { ServiceTokenService } from './serviceToken.service';
import { createLoggerWithContext } from '../common/libs/logger';
import { paginateWithOffset } from '../common/utils/paginateWithOffset';
import { applyFilters } from '../common/utils/applyFilters';
import { NotFoundError } from '../common/errors/NotFoundError';
import { getSnapshotFromCache } from '../api-gateway/snapshotCache';
import { redisClient } from '../../infrastructure/redis';
import { ServiceRepository } from './service.repository';
import { ResourceRepository } from '../resource/resource.repository';

const logger = createLoggerWithContext('ServiceAuthService');
const filterConditionMap: Record<string, string> = {
  active: `(t."is_active" = true AND t."deleted_at" IS NULL)`,
  inactive: `(t."is_active" = false AND t."deleted_at" IS NULL)`,
  deleted: `(t."deleted_at" IS NOT NULL)`,
};

export class ServiceAuthService {
  private serviceRepo = new ServiceRepository(AppDataSource);
  private resourceRepo = new ResourceRepository(AppDataSource);

  buildServiceRef({ id, serviceId, name }: Service): ServiceRef {
    return { id, serviceId, name };
  }
  buildServiceSummary({
    id,
    serviceId,
    name,
    baseUrl,
    ownerTeam,
    isActive,
    lastRotatedAt,
    updatedAt,
    createdAt,
    deletedAt,
  }: Service): ServiceSummary {
    return {
      id,
      serviceId,
      name,
      baseUrl,
      ownerTeam,
      isActive: !!isActive,
      lastRotatedAt: lastRotatedAt?.toISOString() ?? null,
      updatedAt: updatedAt?.toISOString(),
      createdAt: createdAt?.toISOString(),
      deletedAt: deletedAt?.toISOString(),
    };
  }
  buildServiceDetail(service: Service): ServiceDetail {
    return {
      ...service,
      secretVersion: String(service.secretVersion),
      baselineRequiredScopes: service.baselineRequiredScopes ?? [],
      audPrefix: service.audPrefix ?? '',
      isActive: !!service.isActive,
      lastRotatedAt: service.lastRotatedAt?.toISOString() ?? null,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
      deletedAt: service.deletedAt?.toISOString() ?? undefined,
      createdBy: service.createdBy ?? undefined,
      updatedBy: service.updatedBy ?? undefined,
      deletedBy: service.deletedBy ?? undefined,
      routes: service.routes.map(r => ({
        id: r.id,
        serviceId: r.serviceId,
        path: r.path,
        routeRuleType: r.routeRuleType,
        methods: r.methods as HttpMethod[],
        rewrite: r.rewrite,
        isActive: r.isActive,
        createdAt: r.createdAt?.toISOString(),
        updatedAt: r.updatedAt?.toISOString(),
        deletedAt: r.deletedAt?.toISOString(),
      })),
      resources: service.resources.map(r => ({
        id: r.id,
        resource_key: r.resource_key,
        namespace: r.namespace,
        entity: r.entity,
        qualifier: r.qualifier,
        fieldsMode: r.fieldsMode,
        fields: r.fields,
        isActive: r.isActive,
        createdAt: r.createdAt?.toISOString(),
        updatedAt: r.updatedAt?.toISOString(),
        deletedAt: r.deletedAt?.toISOString(),
      })),
    };
  }

  // service login
  async serviceLogin(data: ServiceLogin): Promise<ServiceLoginResponse> {
    const { serviceId, serviceSecret } = data;
    const service = await this.serviceRepo.getByServiceId(serviceId);

    const permissions = service?.grantedScopes ?? [];

    if (
      !service ||
      !service.isActive ||
      !(await argon2.verify(service.serviceSecret, serviceSecret))
    ) {
      throw new UnauthorizedError('Invalid service credentials');
    }

    const servicePayload: ServiceJwtPayload = {
      id: serviceId,
      type: 'service',
      permissions,
      sub: service.serviceId,
      aud: service.audPrefix + service.serviceId,
    };

    const token = await ServiceTokenService.signToken(servicePayload);

    return {
      status: 'success',
      message: 'service login successful',
      data: { token },
    };
  }

  // 发布快照（给网关用）
  async getSnapshot(): Promise<ServiceSnapshotResponse> {
    // 优先读取缓存
    const cached = await getSnapshotFromCache(redisClient);
    if (cached) {
      return cached;
    }

    // 冷启动：仅在缓存为空时，现查一次DB并写回缓存
    const snapshot = await this.serviceRepo.getSnapshots();
    return {
      status: 'success',
      message: 'Get service snapshot successful',
      data: {
        version: Date.now(),
        services: snapshot,
      },
    };
  }

  // create
  async createService(data: ServiceCreateRequest, createdBy: string): Promise<SimpleResponse> {
    const log = logger.child({ method: 'createService', serviceId: data.serviceId, createdBy });

    const newService = await AppDataSource.transaction(async manager => {
      // 创建service
      const newService = await this.serviceRepo.create(data, { createdBy, manager });
      const resourceData: ResourceCreateRequest = {
        namespace: newService.serviceId,
        entity: '*',
        isActive: true,
        qualifier: '*',
        fieldsMode: 'all',
      };
      // 创建resource
      await this.resourceRepo.create(resourceData, { createdBy, manager });
      return newService;
    });
    log.info(`Created service "${newService.serviceId}" by ${createdBy}`);
    return {
      status: 'success',
      message: `Created service "${newService.serviceId}"`,
    };
  }

  // get list
  async getServiceList(pagination: ServiceListRequest): Promise<ServiceListResponse> {
    const result = await this.serviceRepo.getPaginatedList(pagination, { withDeleted: true });
    const pageData = {
      ...result,
      data: result.data.map(srv => this.buildServiceSummary(srv)),
    };
    const response: ServiceListResponse = {
      status: 'success',
      message: 'Get service list successful',
      data: pageData,
    };
    return response;
  }

  // update
  async updateService(
    id: string,
    update: ServiceUpdateRequest,
    updatedBy: string
  ): Promise<SimpleResponse> {
    const log = logger.child({ method: 'updateService', id: update.id, updatedBy });

    await this.serviceRepo.update(id, update, { updatedBy, withDeleted: true });
    log.info(`Updated service "${id}" by ${updatedBy}`);
    return {
      status: 'success',
      message: `Service: ${id} updated by ${updatedBy}`,
    };
  }

  // soft-delete
  async softDeleteService(id: string, deletedBy: string): Promise<SimpleResponse> {
    const log = logger.child({ method: 'softDeleteService', id, deletedBy });
    const service = await this.serviceRepo.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundError(`Service ${id} not found`);
    }

    service.deletedAt = new Date();
    service.deletedBy = deletedBy;
    service.updatedBy = deletedBy;
    const savedService = await this.serviceRepo.save(service);
    log.info(`Soft-deleted service "${savedService.serviceId}" by ${deletedBy}`);
    return {
      status: 'success',
      message: `Service ${savedService.serviceId} soft deleted by ${deletedBy}`,
    };
  }

  // restore
  async restoreService(id: string, restoredBy: string): Promise<SimpleResponse> {
    const log = logger.child({ method: 'restoreService', id, restoredBy });
    const service = await this.serviceRepo.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!service) {
      throw new NotFoundError(`Service ${id} not found`);
    }

    if (!service.deletedAt) {
      return {
        status: 'success',
        message: `Service ${service.serviceId} is not deleted`,
      };
    }

    service.deletedAt = null;
    service.deletedBy = null;
    service.updatedAt = new Date();
    service.updatedBy = restoredBy;

    const savedService = await this.serviceRepo.save(service);
    log.info(`Restored service ${savedService.serviceId} by ${restoredBy}`);
    return {
      status: 'success',
      message: `Service ${savedService.serviceId} restored by ${restoredBy}`,
    };
  }

  // hard-delete
  async hardDeleteService(id: string, deletedBy: string): Promise<SimpleResponse> {
    const log = logger.child({ method: 'hardDeleteService', id, deletedBy });
    const service = await this.serviceRepo.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!service) {
      throw new NotFoundError(`Service ${id} not found`);
    }

    await this.serviceRepo.remove(service);
    log.info(`Service ${service.serviceId} deleted by ${deletedBy} permanently`);

    return {
      status: 'success',
      message: `Service ${service.serviceId} deleted permanently`,
    };
  }

  // get service by id
  async getServiceById(id: string): Promise<ServiceSingleResponse> {
    const service = await this.serviceRepo.findOne({
      where: { id },
      withDeleted: true, // 支持查询软删除的数据，便于编辑/恢复
    });

    if (!service) {
      throw new NotFoundError(`Service ${id} not found`);
    }

    return {
      status: 'success',
      message: `Get service:"${service.serviceId}" successful`,
      data: this.buildService(service),
    };
  }
}
