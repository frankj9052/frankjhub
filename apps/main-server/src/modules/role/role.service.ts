import {
  RoleDto,
  RoleCreateRequest,
  RoleUpdateRequest,
  RoleListRequest,
  RoleListResponse,
  RoleSingleResponse,
  RoleOptionListResponse,
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
            ...role.organization,
            orgTypeId: role.organization.orgType.id,
            orgTypeName: role.organization.orgType.name,
            createdAt: role.organization.createdAt.toISOString(),
            createdBy: role.organization.createdBy ?? null,
            updatedAt: role.organization.updatedAt.toISOString(),
            updatedBy: role.organization.updatedBy ?? null,
            deletedAt: role.organization.deletedAt?.toISOString() ?? null,
            deletedBy: role.organization.deletedBy ?? null,
          }
        : undefined,
      organizationType: role.organizationType
        ? {
            ...role.organizationType,
            createdAt: role.organizationType.createdAt.toISOString(),
            createdBy: role.organizationType.createdBy ?? null,
            updatedAt: role.organizationType.updatedAt.toISOString(),
            updatedBy: role.organizationType.updatedBy ?? null,
            deletedAt: role.organizationType.deletedAt?.toISOString() ?? null,
            deletedBy: role.organizationType.deletedBy ?? null,
          }
        : undefined,
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString(),
      deletedAt: role.deletedAt?.toISOString() ?? null,
      createdBy: role.createdBy ?? null,
      updatedBy: role.updatedBy ?? null,
      deletedBy: role.deletedBy ?? null,
      rolePermissions: role.rolePermissions.map(rp => ({
        id: rp.id,
        name: rp.name,
        isActive: rp.isActive,
        createdAt: rp.createdAt.toISOString(),
        createdBy: rp.createdBy ?? null,
        updatedAt: rp.updatedAt.toISOString(),
        updatedBy: rp.updatedBy ?? null,
        deletedAt: rp.deletedAt?.toISOString() ?? null,
        deletedBy: rp.deletedBy ?? null,
        permission: {
          ...rp.permission,
          resource: {
            ...rp.permission.resource,
            description: rp.permission.resource.description ?? '',
            createdAt: rp.permission.resource.createdAt.toISOString(),
            createdBy: rp.permission.resource.createdBy ?? null,
            updatedAt: rp.permission.resource.updatedAt.toISOString(),
            updatedBy: rp.permission.resource.updatedBy ?? null,
            deletedAt: rp.permission.resource.deletedAt?.toISOString() ?? null,
            deletedBy: rp.permission.resource.deletedBy ?? null,
          },
          createdAt: rp.permission.createdAt.toISOString(),
          createdBy: rp.permission.createdBy ?? null,
          updatedAt: rp.permission.updatedAt.toISOString(),
          updatedBy: rp.permission.updatedBy ?? null,
          deletedAt: rp.permission.deletedAt?.toISOString() ?? null,
          deletedBy: rp.permission.deletedBy ?? null,
        },
        role: { id: role.id },
      })),
    };
  }

  async createRole(data: RoleCreateRequest, createdBy: string): Promise<RoleSingleResponse> {
    const { name, description, permissionIds, roleSource = 'type', sourceId } = data;
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
    if (roleSource === 'org') {
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
          qb.where('t.name ILIKE :search', { search: `%${search.trim()}%` });
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
      data: roles,
    };
  }
}
