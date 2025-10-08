import {
  ServiceCreateRequest,
  ServiceDto,
  ServiceListRequest,
  ServiceListResponse,
  ServiceLogin,
  ServiceLoginResponse,
  ServiceSingleResponse,
  ServiceSnapshot,
  ServiceSnapshotResponse,
  ServiceUpdateRequest,
  SimpleResponse,
} from '@frankjhub/shared-schema';
import AppDataSource from '../../config/data-source';
import { Service } from './entities/Service';
import * as argon2 from 'argon2';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';
import { ServiceTokenService } from './serviceToken.service';
import { env } from '../../config/env';
import { createLoggerWithContext } from '../common/libs/logger';
import { BadRequestError } from '../common/errors/BadRequestError';
import { paginateWithOffset } from '../common/utils/paginateWithOffset';
import { applyFilters } from '../common/utils/applyFilters';
import { NotFoundError } from '../common/errors/NotFoundError';

const logger = createLoggerWithContext('ServiceAuthService');
const filterConditionMap: Record<string, string> = {
  active: `(t."is_active" = true AND t."deleted_at" IS NULL)`,
  inactive: `(t."is_active" = false AND t."deleted_at" IS NULL)`,
  deleted: `(t."deleted_at" IS NOT NULL)`,
};

export class ServiceAuthService {
  private serviceRepo = AppDataSource.getRepository(Service);

  buildService(service: Service): ServiceDto {
    return {
      ...service,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
      deletedAt: service.deletedAt?.toISOString() ?? undefined,
      createdBy: service.createdBy ?? undefined,
      updatedBy: service.updatedBy ?? undefined,
      deletedBy: service.deletedBy ?? undefined,
    };
  }

  // service login
  async serviceLogin(data: ServiceLogin): Promise<ServiceLoginResponse> {
    const { serviceId, serviceSecret } = data;
    const service = await this.serviceRepo.findOne({ where: { serviceId } });

    const routesScopes = service?.routes.flatMap(r => r.requiredScopes) ?? [];
    const scopes = routesScopes.concat(service?.requiredScopes ?? []);

    if (
      !service ||
      !service.isActive ||
      !(await argon2.verify(service.serviceSecret, serviceSecret))
    ) {
      throw new UnauthorizedError('Invalid service credentials');
    }

    const token = await ServiceTokenService.signToken({
      serviceId,
      scopes,
      iss: env.JWT_ISSUER,
      sub: service.serviceId,
      aud: service.audPrefix + service.serviceId,
    });

    return {
      status: 'success',
      message: 'service login successful',
      data: { token },
    };
  }

  // 发布快照（给网关用）
  async getSnapshot(): Promise<ServiceSnapshotResponse> {
    const services = await this.serviceRepo.find({ where: { isActive: true } });
    const snapshot: ServiceSnapshot = services.map(s => ({
      key: s.serviceId,
      aud: `${s.audPrefix}${s.serviceId}`, // e.g. api://booking
      baseUrl: s.baseUrl,
      requiredScopes: s.requiredScopes,
      routes: s.routes,
    }));
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

    const existing = await this.serviceRepo.exists({ where: { serviceId: data.serviceId } });
    if (existing) {
      throw new BadRequestError(`Service "${data.serviceId}" already exists`);
    }

    const newService = this.serviceRepo.create({
      ...data,
      createdBy,
      updatedBy: createdBy,
    });
    const savedService = await this.serviceRepo.save(newService);
    log.info(`Created service "${savedService.serviceId}" by ${createdBy}`);
    return {
      status: 'success',
      message: `Created service "${savedService.serviceId}"`,
    };
  }

  // get list
  async getServiceList(pagination: ServiceListRequest): Promise<ServiceListResponse> {
    const result = await paginateWithOffset({
      repo: this.serviceRepo,
      pagination,
      modifyQueryBuilder: qb => {
        const { search, filters } = pagination;
        // 搜索条件
        if (search) {
          qb.where('t.serviceId ILIKE :search OR t.name ILIKE :search', {
            search: `%${search.trim()}%`,
          });
        }
        // 状态过滤
        applyFilters(qb, filters, {
          byKey: {
            status: filterConditionMap,
          },
        });
        return qb.withDeleted();
      },
    });
    const pageData = {
      ...result,
      data: result.data.map(srv => this.buildService(srv)),
    };
    const response: ServiceListResponse = {
      status: 'success',
      message: 'Get service list successful',
      data: pageData,
    };
    return response;
  }

  // update
  async updateService(update: ServiceUpdateRequest, updatedBy: string): Promise<SimpleResponse> {
    const log = logger.child({ method: 'updateService', id: update.id, updatedBy });

    const { id } = update;
    const service = await this.serviceRepo.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!service) {
      throw new NotFoundError(`Service ${id} not found`);
    }

    for (const [key, value] of Object.entries(update)) {
      if (key === 'id') continue;
      if (value !== undefined) {
        (service as any)[key] = value;
      }
    }
    service.updatedBy = updatedBy;
    const savedService = await this.serviceRepo.save(service);
    log.info(`Updated service "${savedService.serviceId}" by ${updatedBy}`);
    return {
      status: 'success',
      message: `Service: ${savedService.serviceId} updated by ${updatedBy}`,
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
