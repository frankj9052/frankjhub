import AppDataSource from '../../config/data-source';
import { Organization } from './entities/Organization';
import { NotFoundError } from '../common/errors/NotFoundError';
import { createLoggerWithContext } from '../common/libs/logger';
import { paginateWithOffset } from '../common/utils/paginateWithOffset';
import {
  OrganizationCreateRequest,
  OrganizationDto,
  OrganizationListRequest,
  OrganizationListResponse,
  OrganizationOption,
  OrganizationOptionListResponse,
  OrganizationSingleResponse,
  OrganizationUpdateRequest,
} from '@frankjhub/shared-schema';
import { OrganizationType } from '../organizationType/entities/OrganizationType';
import { BadRequestError } from '../common/errors/BadRequestError';
import { applyFilters } from '../common/utils/applyFilters';

const logger = createLoggerWithContext('OrganizationService');

const filterConditionMap: Record<string, string> = {
  active: `(t."is_active" = true AND t."deleted_at" IS NULL)`,
  inactive: `(t."is_active" = false AND t."deleted_at" IS NULL)`,
  deleted: `(t."deleted_at" IS NOT NULL)`,
};

export class OrganizationService {
  private orgRepo = AppDataSource.getRepository(Organization);
  private orgTypeRepo = AppDataSource.getRepository(OrganizationType);

  buildOrganization(org: Organization): OrganizationDto {
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

  buildOrganizationOption(org: Organization): OrganizationOption {
    return {
      id: org.id,
      name: org.name,
      orgTypeId: org.orgType.id,
      orgTypeName: org.orgType.name,
    };
  }

  async createOrganization(
    data: OrganizationCreateRequest,
    createdBy: string
  ): Promise<OrganizationSingleResponse> {
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
    const savedOrg = await this.orgRepo.save(organization);

    const fullOrg = await this.orgRepo.findOne({
      where: { id: savedOrg.id },
      relations: {
        orgType: true,
      },
    });

    if (!fullOrg) {
      throw new NotFoundError('created org not found');
    }

    log.info(`Created organization "${name}"`);
    return {
      status: 'success',
      message: `Created organization "${name}"`,
      data: this.buildOrganization(fullOrg),
    };
  }

  async getAllOrganizations(
    pagination: OrganizationListRequest
  ): Promise<OrganizationListResponse> {
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
        applyFilters(qb, filters, {
          byKey: {
            status: filterConditionMap,
          },
        });
        return qb.withDeleted().leftJoinAndSelect('t.orgType', 'orgType');
      },
    });
    const pageData = {
      ...result,
      data: result.data.map(org => this.buildOrganization(org)),
    };

    const response: OrganizationListResponse = {
      status: 'success',
      message: 'Get organization list successful',
      data: pageData,
    };
    return response;
  }

  async getOrganizationOptionList(): Promise<OrganizationOptionListResponse> {
    const organizations = await this.orgRepo
      .createQueryBuilder('org')
      .leftJoinAndSelect('org.orgType', 'orgType')
      .where('org.isActive = :active', { active: true })
      .select(['org.id', 'org.name', 'orgType.id', 'orgType.name'])
      .orderBy('org.name', 'ASC')
      .getMany();

    return {
      status: 'success',
      message: 'Fetched organization option list successfully',
      data: organizations.map(org => this.buildOrganizationOption(org)),
    };
  }

  async getOrganizationById(id: string): Promise<OrganizationSingleResponse> {
    const org = await this.orgRepo.findOne({
      where: { id },
      relations: ['orgType'],
      withDeleted: true,
    });
    if (!org) {
      throw new NotFoundError(`Organization ${id} not found`);
    }
    return {
      status: 'success',
      message: 'Get organization successful',
      data: this.buildOrganization(org),
    };
  }

  async updateOrganization(
    update: OrganizationUpdateRequest,
    performedBy: string
  ): Promise<OrganizationSingleResponse> {
    const { id } = update;
    const org = await this.orgRepo.findOne({
      where: { id },
      withDeleted: true,
      relations: { orgType: true },
    });
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
    org.updatedAt = new Date();
    const savedOrg = await this.orgRepo.save(org);

    const fullOrg = await this.orgRepo.findOne({
      where: { id: savedOrg.id },
      relations: {
        orgType: true,
      },
    });

    if (!fullOrg) {
      throw new NotFoundError('Updated org not found');
    }

    return {
      status: 'success',
      message: `Organization ${fullOrg.name} updated by ${performedBy}`,
      data: this.buildOrganization(fullOrg),
    };
  }

  async softDeleteOrganization(
    id: string,
    performedBy: string
  ): Promise<OrganizationSingleResponse> {
    const org = await this.orgRepo.findOne({ where: { id }, relations: { orgType: true } });
    if (!org) {
      throw new NotFoundError(`Organization ${id} not found`);
    }

    org.deletedAt = new Date();
    org.deletedBy = performedBy;
    await this.orgRepo.save(org);

    return {
      status: 'success',
      message: `Organization ${org.name} soft deleted by ${performedBy}`,
      data: this.buildOrganization(org),
    };
  }

  async restoreOrganization(id: string, performedBy: string): Promise<OrganizationSingleResponse> {
    const org = await this.orgRepo.findOne({
      where: { id },
      withDeleted: true,
      relations: { orgType: true },
    });
    if (!org) {
      throw new NotFoundError(`Organization ${id} not found`);
    }

    if (!org.deletedAt) {
      return {
        status: 'success',
        message: `Organization ${org.name} is not deleted`,
        data: this.buildOrganization(org),
      };
    }

    org.deletedAt = null;
    org.deletedBy = null;
    org.updatedAt = new Date();
    org.updatedBy = performedBy;

    await this.orgRepo.save(org);

    return {
      status: 'success',
      message: `Organization ${org.name} restored by ${performedBy}`,
      data: this.buildOrganization(org),
    };
  }

  async hardDeleteOrganization(id: string): Promise<OrganizationSingleResponse> {
    const org = await this.orgRepo.findOne({
      where: { id },
      withDeleted: true,
      relations: { orgType: true },
    });
    if (!org) {
      throw new NotFoundError(`Organization ${id} not found`);
    }

    await this.orgRepo.remove(org);

    return {
      status: 'success',
      message: `Organization ${org.name} permanently deleted`,
      data: this.buildOrganization(org),
    };
  }
}
