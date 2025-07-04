import AppDataSource from '../../config/data-source';
import { Organization } from './entities/Organization';
import { NotFoundError } from '../common/errors/NotFoundError';
import { createLoggerWithContext } from '../common/libs/logger';
import { paginateWithOffset } from '../common/utils/paginateWithOffset';
import {
  OrganizationCreateSchema,
  OrganizationPaginatedResponse,
  OrganizationPaginationParams,
  OrganizationUpdateSchema,
  OrganizationWithOrgTypeNameSchema,
  SuccessResponse,
} from '@frankjhub/shared-schema';
import { OrganizationType } from '../organizationType/entities/OrganizationType';
import { BadRequestError } from '../common/errors/BadRequestError';

const logger = createLoggerWithContext('OrganizationService');

const filterConditionMap: Record<string, string> = {
  active: `(t."is_active" = true AND t."deleted_at" IS NULL)`,
  inactive: `(t."is_active" = false AND t."deleted_at" IS NULL)`,
  deleted: `(t."deleted_at" IS NOT NULL)`,
};

export class OrganizationService {
  private orgRepo = AppDataSource.getRepository(Organization);
  private orgTypeRepo = AppDataSource.getRepository(OrganizationType);

  buildOrganizationWithOrgTypeName(org: Organization): OrganizationWithOrgTypeNameSchema {
    return {
      id: org.id,
      name: org.name,
      description: org.description ?? null,
      orgTypeId: org.orgType.id,
      orgTypeName: org.orgType.name,
      isActive: org.isActive,
      createdAt: org.createdAt.toISOString(),
      updatedAt: org.updatedAt.toISOString(),
      deletedAt: org.deletedAt?.toISOString() ?? null,
      createdBy: org.createdBy ?? null,
      updatedBy: org.updatedBy ?? null,
      deletedBy: org.deletedBy ?? null,
    };
  }

  async createOrganization(
    data: OrganizationCreateSchema,
    createdBy: string
  ): Promise<Organization> {
    const { name, description, orgTypeId } = data;
    const log = logger.child({ method: 'createOrganization', name });

    const existing = await this.orgRepo.findOne({ where: { name } });
    if (existing) {
      throw new BadRequestError(`Organization "${name}" already exists`);
    }
    const orgTypeExisting = await this.orgTypeRepo.findBy({ id: orgTypeId });
    if (!orgTypeExisting) {
      throw new NotFoundError(`Organization type ${orgTypeId} not found`);
    }

    const organization = this.orgRepo.create({
      name,
      description: description ?? undefined,
      orgType: { id: orgTypeId },
      createdBy,
    });
    await this.orgRepo.save(organization);

    log.info(`Created organization "${name}"`);
    return organization;
  }

  async getAllOrganizations(
    pagination: OrganizationPaginationParams
  ): Promise<OrganizationPaginatedResponse> {
    const result = await paginateWithOffset({
      repo: this.orgRepo,
      pagination,
      fieldMap: {
        orgTypeName: 'orgType.name',
      },
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
        return qb.withDeleted().leftJoinAndSelect('t.orgType', 'orgType');
      },
    });
    const response = {
      ...result,
      data: result.data.map(org => this.buildOrganizationWithOrgTypeName(org)),
    };
    return response;
  }

  async getOrganizationById(id: string): Promise<OrganizationWithOrgTypeNameSchema> {
    const org = await this.orgRepo.findOne({
      where: { id },
      relations: ['orgType'],
      withDeleted: true,
    });
    if (!org) {
      throw new NotFoundError(`Organization ${id} not found`);
    }
    return this.buildOrganizationWithOrgTypeName(org);
  }

  async updateOrganization(
    update: OrganizationUpdateSchema,
    performedBy: string
  ): Promise<SuccessResponse> {
    const { id } = update;
    const org = await this.orgRepo.findOne({ where: { id }, withDeleted: true });
    if (!org) {
      throw new NotFoundError(`Organization ${id} not found`);
    }

    for (const [key, value] of Object.entries(update)) {
      if (key === 'id') continue;
      if (value !== undefined) {
        if (key === 'orgType') {
          (org as any)[key] = { id: value };
        } else {
          (org as any)[key] = value;
        }
      }
    }

    org.updatedBy = performedBy;
    await this.orgRepo.save(org);

    return {
      status: 'success',
      message: `Organization ${id} updated by ${performedBy}`,
    };
  }

  async softDeleteOrganization(id: string, performedBy: string): Promise<SuccessResponse> {
    const org = await this.orgRepo.findOne({ where: { id } });
    if (!org) {
      throw new NotFoundError(`Organization ${id} not found`);
    }

    await this.orgRepo.update(id, {
      deletedAt: new Date().toISOString(),
      deletedBy: performedBy,
    });

    return {
      status: 'success',
      message: `Organization ${id} soft deleted by ${performedBy}`,
    };
  }

  async restoreOrganization(id: string, performedBy: string): Promise<SuccessResponse> {
    const org = await this.orgRepo.findOne({ where: { id }, withDeleted: true });
    if (!org) {
      throw new NotFoundError(`Organization ${id} not found`);
    }

    if (!org.deletedAt) {
      return {
        status: 'success',
        message: `Organization ${id} is not deleted`,
      };
    }

    await this.orgRepo.update(id, {
      deletedAt: null,
      deletedBy: null,
      updatedBy: performedBy,
    });

    return {
      status: 'success',
      message: `Organization ${id} restored by ${performedBy}`,
    };
  }

  async hardDeleteOrganization(id: string): Promise<SuccessResponse> {
    const org = await this.orgRepo.findOne({ where: { id }, withDeleted: true });
    if (!org) {
      throw new NotFoundError(`Organization ${id} not found`);
    }

    await this.orgRepo.remove(org);

    return {
      status: 'success',
      message: `Organization ${id} permanently deleted`,
    };
  }
}
