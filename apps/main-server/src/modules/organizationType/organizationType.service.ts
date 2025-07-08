import AppDataSource from '../../config/data-source';
import { OrganizationType } from './entities/OrganizationType';
import { NotFoundError } from '../common/errors/NotFoundError';
import { createLoggerWithContext } from '../common/libs/logger';
import { paginateWithOffset } from '../common/utils/paginateWithOffset';
import {
  OrganizationTypeCreateRequest,
  OrganizationTypeDto,
  OrganizationTypeListPageData,
  OrganizationTypeListRequest,
  OrganizationTypeListResponse,
  OrganizationTypeOption,
  OrganizationTypeOptionListResponse,
  organizationTypeSingleResponse,
  OrganizationTypeUpdateRequest,
} from '@frankjhub/shared-schema';

const logger = createLoggerWithContext('OrganizationTypeService');

const filterConditionMap: Record<string, string> = {
  active: `(t."is_active" = true AND t."deleted_at" IS NULL)`,
  inactive: `(t."is_active" = false AND t."deleted_at" IS NULL)`,
  deleted: `(t."deleted_at" IS NOT NULL)`,
};

export class OrganizationTypeService {
  private orgTypeRepo = AppDataSource.getRepository(OrganizationType);
  buildOrganizationType(orgType: OrganizationType): OrganizationTypeDto {
    return {
      id: orgType.id,
      name: orgType.name,
      description: orgType.description ?? null,
      isActive: orgType.isActive,
      createdAt: orgType.createdAt.toISOString(),
      updatedAt: orgType.updatedAt.toISOString(),
      deletedAt: orgType.deletedAt?.toISOString() ?? null,
      createdBy: orgType.createdBy ?? null,
      updatedBy: orgType.updatedBy ?? null,
      deletedBy: orgType.deletedBy ?? null,
    };
  }
  buildOrganizationTypeOption(orgType: OrganizationType): OrganizationTypeOption {
    return {
      id: orgType.id,
      name: orgType.name,
    };
  }
  async createOrganizationType(
    data: OrganizationTypeCreateRequest,
    createdBy: string
  ): Promise<organizationTypeSingleResponse> {
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
    const savedOrgType = await this.orgTypeRepo.save(orgType);
    log.info(`Created organization type "${name}"`);
    const response: organizationTypeSingleResponse = {
      status: 'success',
      message: `Created organization type "${name}"`,
      data: this.buildOrganizationType(savedOrgType),
    };
    return response;
  }

  async getAllOrganizationTypes(
    pagination: OrganizationTypeListRequest
  ): Promise<OrganizationTypeListResponse> {
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
    const orgTypeListPageData: OrganizationTypeListPageData = {
      ...result,
      data: result.data.map(orgType => this.buildOrganizationType(orgType)),
    };
    const response: OrganizationTypeListResponse = {
      status: 'success',
      message: 'Get organization type list succcessful',
      data: orgTypeListPageData,
    };
    return response;
  }

  async getOrganizationTypeById(id: string): Promise<organizationTypeSingleResponse> {
    const orgType = await this.orgTypeRepo.findOne({ where: { id }, withDeleted: true });
    if (!orgType) {
      throw new NotFoundError(`OrganizationType ${id} not found`);
    }
    return {
      status: 'success',
      message: 'Get organization type successful',
      data: this.buildOrganizationType(orgType),
    };
  }

  async updateOrganizationType(
    update: OrganizationTypeUpdateRequest,
    performedBy: string
  ): Promise<organizationTypeSingleResponse> {
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

    const savedOrgType = await this.orgTypeRepo.save(orgType);

    return {
      status: 'success',
      message: `OrganizationType ${savedOrgType.name} updated by ${performedBy}`,
      data: this.buildOrganizationType(savedOrgType),
    };
  }

  async softDeleteOrganizationType(
    id: string,
    performedBy: string
  ): Promise<organizationTypeSingleResponse> {
    const orgType = await this.orgTypeRepo.findOne({ where: { id } });
    if (!orgType) {
      throw new NotFoundError(`OrganizationType ${id} not found`);
    }

    orgType.deletedAt = new Date();
    orgType.deletedBy = performedBy;

    const savedOrgType = await this.orgTypeRepo.save(orgType);
    return {
      status: 'success',
      message: `OrganizationType ${savedOrgType.name} is deleted by ${performedBy}`,
      data: this.buildOrganizationType(savedOrgType),
    };
  }

  async restoreOrganizationType(
    id: string,
    performedBy: string
  ): Promise<organizationTypeSingleResponse> {
    const orgType = await this.orgTypeRepo.findOne({ where: { id }, withDeleted: true });
    if (!orgType) {
      throw new NotFoundError(`OrganizationType ${id} not found`);
    }

    if (!orgType.deletedAt) {
      return {
        status: 'success',
        message: `OrganizationType ${orgType.name} is not deleted`,
        data: this.buildOrganizationType(orgType),
      };
    }

    orgType.deletedAt = null;
    orgType.deletedBy = null;
    orgType.updatedBy = performedBy;
    orgType.updatedAt = new Date();

    const savedOrgType = await this.orgTypeRepo.save(orgType);

    return {
      status: 'success',
      message: `OrganizationType ${savedOrgType.name} restored by ${performedBy}`,
      data: this.buildOrganizationType(savedOrgType),
    };
  }

  async hardDeleteOrganizationType(id: string): Promise<organizationTypeSingleResponse> {
    const orgType = await this.orgTypeRepo.findOne({ where: { id }, withDeleted: true });
    if (!orgType) {
      throw new NotFoundError(`OrganizationType ${id} not found`);
    }

    await this.orgTypeRepo.remove(orgType);

    return {
      status: 'success',
      message: `OrganizationType ${orgType.name} is permanently deleted`,
      data: this.buildOrganizationType(orgType),
    };
  }

  async getAllOrgTypeOptions(): Promise<OrganizationTypeOptionListResponse> {
    const orgTypes = await this.orgTypeRepo.find({
      select: ['id', 'name'],
      where: {
        isActive: true,
      },
      order: {
        name: 'ASC',
      },
    });

    return {
      status: 'success',
      message: 'Get organization type options successful',
      data: orgTypes.map(orgType => this.buildOrganizationTypeOption(orgType)),
    };
  }
}
