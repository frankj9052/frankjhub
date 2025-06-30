import AppDataSource from '../../config/data-source';
import { OrganizationType } from './entities/OrganizationType';
import { NotFoundError } from '../common/errors/NotFoundError';
import { createLoggerWithContext } from '../common/libs/logger';
import { paginateWithOffset } from '../common/utils/paginateWithOffset';
import {
  OrganizationTypeCreateSchema,
  OrganizationTypePaginatedResponse,
  OrganizationTypePaginationParams,
  OrganizationTypeSchema,
  OrganizationTypeUpdateSchema,
  SuccessResponse,
} from '@frankjhub/shared-schema';

const logger = createLoggerWithContext('OrganizationTypeService');

const filterConditionMap: Record<string, string> = {
  active: `(t."is_active" = true AND t."deleted_at" IS NULL)`,
  inactive: `(t."is_active" = false AND t."deleted_at" IS NULL)`,
  deleted: `(t."deleted_at" IS NOT NULL)`,
};

export class OrganizationTypeService {
  private orgTypeRepo = AppDataSource.getRepository(OrganizationType);
  buildOrganizationType(type: OrganizationType): OrganizationTypeSchema {
    return {
      id: type.id,
      name: type.name,
      description: type.description ?? null,
      isActive: type.isActive,
      createdAt: type.createdAt.toISOString(),
      updatedAt: type.updatedAt.toISOString(),
      deletedAt: type.deletedAt?.toISOString() ?? null,
      createdBy: type.createdBy ?? null,
      updatedBy: type.updatedBy ?? null,
      deletedBy: type.deletedBy ?? null,
    };
  }
  async createOrganizationType(
    data: OrganizationTypeCreateSchema,
    createdBy: string
  ): Promise<OrganizationType> {
    const { name, description } = data;
    const log = logger.child({ method: 'createOrganizationType', name });

    const existing = await this.orgTypeRepo.findOne({ where: { name } });
    if (existing) {
      throw new Error(`Organization type "${name}" already exists`);
    }

    const orgType = this.orgTypeRepo.create({
      name,
      description: description ?? undefined,
      createdBy,
    });
    await this.orgTypeRepo.save(orgType);

    log.info(`Created organization type "${name}"`);
    return orgType;
  }

  async getAllOrganizationTypes(
    pagination: OrganizationTypePaginationParams
  ): Promise<OrganizationTypePaginatedResponse> {
    const result = await paginateWithOffset({
      repo: this.orgTypeRepo,
      pagination,
      modifyQueryBuilder: qb => {
        const { search, filters } = pagination;
        if (search) {
          qb.where('t.name ILIKE :search OR t.description ILIKE :search', {
            search: `%${search.trim()}%`,
          });
        }
        // 态筛选（支持多选 OR 组合）
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
      data: result.data.map(orgType => this.buildOrganizationType(orgType)),
    };
    return response;
  }

  async getOrganizationTypeById(id: string): Promise<OrganizationType> {
    const orgType = await this.orgTypeRepo.findOne({ where: { id }, withDeleted: true });
    if (!orgType) {
      throw new NotFoundError(`OrganizationType ${id} not found`);
    }
    return orgType;
  }

  async updateOrganizationType(
    update: OrganizationTypeUpdateSchema,
    performedBy: string
  ): Promise<SuccessResponse> {
    const { id } = update;
    const orgType = await this.orgTypeRepo.findOne({ where: { id }, withDeleted: true });
    if (!orgType) {
      throw new NotFoundError(`OrganizationType ${id} not found`);
    }

    for (const [key, value] of Object.entries(update)) {
      if (key === 'id') continue;
      if (value !== undefined) {
        (orgType as any)[key] = value;
      }
    }

    await this.orgTypeRepo.save(orgType);

    return {
      status: 'success',
      message: `OrganizationType ${id} updated by ${performedBy}`,
    };
  }

  async softDeleteOrganizationType(id: string, performedBy: string): Promise<SuccessResponse> {
    const orgType = await this.orgTypeRepo.findOne({ where: { id } });
    if (!orgType) {
      throw new NotFoundError(`OrganizationType ${id} not found`);
    }

    await this.orgTypeRepo.update(id, {
      deletedAt: new Date().toISOString(),
      deletedBy: performedBy,
    });

    return {
      status: 'success',
      message: `OrganizationType ${id} soft deleted by ${performedBy}`,
    };
  }

  async restoreOrganizationType(id: string, performedBy: string): Promise<SuccessResponse> {
    const orgType = await this.orgTypeRepo.findOne({ where: { id }, withDeleted: true });
    if (!orgType) {
      throw new NotFoundError(`OrganizationType ${id} not found`);
    }

    if (!orgType.deletedAt) {
      return {
        status: 'success',
        message: `OrganizationType ${id} is not deleted`,
      };
    }

    await this.orgTypeRepo.update(id, {
      deletedAt: null,
      deletedBy: null,
      updatedBy: performedBy,
    });

    return {
      status: 'success',
      message: `OrganizationType ${id} restored by ${performedBy}`,
    };
  }

  async hardDeleteOrganizationType(id: string): Promise<SuccessResponse> {
    const orgType = await this.orgTypeRepo.findOne({ where: { id }, withDeleted: true });
    if (!orgType) {
      throw new NotFoundError(`OrganizationType ${id} not found`);
    }

    await this.orgTypeRepo.remove(orgType);

    return {
      status: 'success',
      message: `OrganizationType ${id} permanently deleted`,
    };
  }
}
