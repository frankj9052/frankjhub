import {
  RoleDto,
  RoleCreateRequest,
  RoleUpdateRequest,
  RoleListRequest,
  RoleListResponse,
  RoleSingleResponse,
  RoleOptionListResponse,
  RoleSource,
} from '@frankjhub/shared-schema';
import AppDataSource from '../../config/data-source';
import { Role } from './entities/Role';
import { Permission } from '../permission/entities/Permission';
import { RolePermission } from './entities/RolePermission';
import { Organization } from '../organization/entities/Organization';
import { OrganizationType } from '../organizationType/entities/OrganizationType';
import { logger } from '../common/libs/logger';
import { NotFoundError } from '../common/errors/NotFoundError';
import { BadRequestError } from '../common/errors/BadRequestError';
import { paginateWithOffset } from '../common/utils/paginateWithOffset';
import { In } from 'typeorm';

const filterConditionMap: Record<string, string> = {
  active: `(t."is_active" = true AND t."deleted_at" IS NULL)`,
  inactive: `(t."is_active" = false AND t."deleted_at" IS NULL)`,
  deleted: `(t."deleted_at" IS NOT NULL)`,
  source_organization: `(t."organization" IS NOT NULL)`,
  source_organization_type: `(t."organization_type" IS NOT NULL)`,
};

export class RoleService {
  private roleRepo = AppDataSource.getRepository(Role);
  private permissionRepo = AppDataSource.getRepository(Permission);
  private rolePermissionRepo = AppDataSource.getRepository(RolePermission);
  private orgRepo = AppDataSource.getRepository(Organization);
  private orgTypeRepo = AppDataSource.getRepository(OrganizationType);

  buildRole(role: Role): RoleDto {
    return {
      id: role.id,
      code: role.code,
      name: role.name,
      description: role.description ?? '',
      isActive: role.isActive ?? true,
      roleSource: role.roleSource,
      organization: role.organization
        ? {
            id: role.organization.id,
            name: role.organization.name,
            description: role.organization.description,
            orgTypeId: role.organization.orgType.id,
            orgTypeName: role.organization.orgType.name,
          }
        : undefined,
      organizationType: role.organizationType
        ? {
            id: role.organizationType.id,
            name: role.organizationType.name,
            description: role.organizationType.description,
          }
        : undefined,
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString(),
      deletedAt: role.deletedAt?.toISOString() ?? null,
      createdBy: role.createdBy ?? null,
      updatedBy: role.updatedBy ?? null,
      deletedBy: role.deletedBy ?? null,
      permissions: role.rolePermissions.map(rp => ({
        id: rp.permission.id,
        name: rp.permission.name,
        description: rp.permission.description,
      })),
    };
  }

  async createRole(data: RoleCreateRequest, createdBy: string): Promise<RoleSingleResponse> {
    const { name, description, permissionIds, roleSource, sourceId } = data;
    const log = logger.child({ method: 'createRole', name, createdBy });

    let organization: Organization | undefined;
    let organizationType: OrganizationType | undefined;

    if (roleSource === 'org') {
      organization = await this.orgRepo.findOneByOrFail({ id: sourceId });
    } else {
      organizationType = await this.orgTypeRepo.findOneByOrFail({ id: sourceId });
    }

    const permissions = await this.permissionRepo.findBy({ id: In(permissionIds) });
    if (permissions.length !== permissionIds.length)
      throw new BadRequestError('One or more permissions not found');

    const role = this.roleRepo.create({
      name,
      description,
      roleSource,
      organization,
      organizationType,
      createdBy,
    });

    const saved = await this.roleRepo.save(role);

    const rolePermissions = permissions.map(permission =>
      this.rolePermissionRepo.create({
        role: saved,
        permission,
        createdBy,
      })
    );
    await this.rolePermissionRepo.save(rolePermissions);

    const reloaded = await this.roleRepo.findOneOrFail({
      where: { id: saved.id },
      relations: {
        organization: true,
        organizationType: true,
        rolePermissions: { permission: true },
      },
    });

    log.info(`Role "${saved.name}" created by ${createdBy}`);
    return {
      status: 'success',
      message: 'Role created successfully',
      data: this.buildRole(reloaded),
    };
  }

  async updateRole(data: RoleUpdateRequest, updatedBy: string): Promise<RoleSingleResponse> {
    const { id, name, description, isActive, roleSource, sourceId, permissionIds } = data;
    const log = logger.child({ method: 'updateRole', id, updatedBy });

    const role = await this.roleRepo.findOne({
      where: { id },
      relations: {
        organization: true,
        organizationType: true,
        rolePermissions: { permission: true },
      },
    });
    if (!role) throw new NotFoundError('Role not found');

    // handle source switch
    if (roleSource === RoleSource.ORG) {
      role.organization = sourceId
        ? await this.orgRepo.findOneByOrFail({ id: sourceId })
        : role.organization;
      role.organizationType = null;
    } else if (roleSource === 'type') {
      role.organizationType = sourceId
        ? await this.orgTypeRepo.findOneByOrFail({ id: sourceId })
        : role.organizationType;
      role.organization = null;
    }

    role.name = name ?? role.name;
    role.description = description ?? role.description;
    role.isActive = typeof isActive === 'boolean' ? isActive : role.isActive;
    role.roleSource = roleSource ?? role.roleSource;
    role.updatedBy = updatedBy;
    await this.roleRepo.save(role);

    // update permissions if changed
    if (permissionIds) {
      await this.rolePermissionRepo.delete({ role: { id: role.id } });
      const newPermissions = await this.permissionRepo.findBy({ id: In(permissionIds) });
      const rolePermissions = newPermissions.map(permission =>
        this.rolePermissionRepo.create({ role, permission, createdBy: updatedBy })
      );
      await this.rolePermissionRepo.save(rolePermissions);
    }

    const reloaded = await this.roleRepo.findOneOrFail({
      where: { id },
      relations: {
        organization: true,
        organizationType: true,
        rolePermissions: { permission: true },
      },
    });

    log.info(`Role "${role.name}" updated by ${updatedBy}`);
    return {
      status: 'success',
      message: 'Role updated successfully',
      data: this.buildRole(reloaded),
    };
  }

  async getRoleList(pagination: RoleListRequest): Promise<RoleListResponse> {
    const result = await paginateWithOffset({
      repo: this.roleRepo,
      pagination,
      modifyQueryBuilder: qb => {
        const { search, filters } = pagination;
        if (search) {
          qb.where('t.name ILIKE :search OR t.description ILIKE :search', {
            search: `%${search.trim()}%`,
          });
        }

        // 状态过滤（active / inactive / deleted）
        if (filters?.length) {
          const validConditions = filters.map(status => filterConditionMap[status]).filter(Boolean);
          if (validConditions.length > 0) {
            qb.andWhere(`(${validConditions.join(' OR ')})`);
          }
        }
        return qb
          .leftJoinAndSelect('t.organization', 'organization')
          .leftJoinAndSelect('t.organizationType', 'organizationType')
          .leftJoinAndSelect('t.rolePermissions', 'rolePermissions')
          .leftJoinAndSelect('rolePermissions.permission', 'permission')
          .withDeleted();
      },
    });
    return {
      status: 'success',
      message: 'Get role list successful',
      data: {
        ...result,
        data: result.data.map(this.buildRole),
      },
    };
  }

  async getRoleById(id: string): Promise<RoleSingleResponse> {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: {
        organization: true,
        organizationType: true,
        rolePermissions: { permission: true },
      },
      withDeleted: true,
    });
    if (!role) throw new NotFoundError('Role not found');

    return { status: 'success', message: 'Get role successful', data: this.buildRole(role) };
  }

  async softDeleteRole(id: string, performedBy: string): Promise<RoleSingleResponse> {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: {
        organization: true,
        organizationType: true,
        rolePermissions: { permission: true },
      },
    });
    if (!role) throw new NotFoundError('Role not found');

    role.deletedAt = new Date();
    role.deletedBy = performedBy;
    role.updatedBy = performedBy;
    const saved = await this.roleRepo.save(role);

    return { status: 'success', message: 'Role soft-deleted', data: this.buildRole(saved) };
  }

  async restoreRole(id: string, performedBy: string): Promise<RoleSingleResponse> {
    const role = await this.roleRepo.findOne({
      where: { id },
      withDeleted: true,
      relations: {
        organization: true,
        organizationType: true,
        rolePermissions: { permission: true },
      },
    });
    if (!role) throw new NotFoundError('Role not found');

    if (!role.deletedAt) {
      return { status: 'success', message: 'Role is already active', data: this.buildRole(role) };
    }

    role.deletedAt = null;
    role.deletedBy = null;
    role.updatedBy = performedBy;
    const saved = await this.roleRepo.save(role);

    return { status: 'success', message: 'Role restored', data: this.buildRole(saved) };
  }

  async hardDeleteRole(id: string): Promise<RoleSingleResponse> {
    const role = await this.roleRepo.findOne({
      where: { id },
      withDeleted: true,
      relations: {
        organization: true,
        organizationType: true,
        rolePermissions: { permission: true },
      },
    });
    if (!role) throw new NotFoundError('Role not found');

    await this.rolePermissionRepo.delete({ role: { id } });
    await this.roleRepo.remove(role);

    return { status: 'success', message: 'Role permanently deleted', data: this.buildRole(role) };
  }

  async getRoleOptionList(): Promise<RoleOptionListResponse> {
    const roles = await this.roleRepo.find({
      select: ['id', 'name', 'code'],
      order: { name: 'ASC' },
    });
    return {
      status: 'success',
      message: 'Get role options successful',
      data: roles.map(r => ({
        id: r.id,
        name: r.name,
        code: r.code,
      })),
    };
  }
}
