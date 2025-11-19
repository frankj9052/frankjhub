import {
  PermissionCreateRequest,
  PermissionDetail,
  PermissionDetailResponse,
  PermissionListRequest,
  PermissionListResponse,
  PermissionOptionListResponse,
  PermissionRef,
  PermissionSummary,
  PermissionUpdateRequest,
  SimpleResponse,
} from '@frankjhub/shared-schema';
import AppDataSource from '../../config/data-source';
import { Permission } from './entities/Permission';
import { logger } from '../common/libs/logger';
import { NotFoundError } from '../common/errors/NotFoundError';
import { PermissionRepository } from './permission.repository';

export class PermissionService {
  private permissionRepo = new PermissionRepository(AppDataSource);

  buildPermissionRef({ id, name }: Permission): PermissionRef {
    return { id, name };
  }

  buildPermissionSummary({
    createdAt,
    id,
    name,
    effect,
    isActive,
    updatedAt,
    deletedAt,
  }: Permission): PermissionSummary {
    return {
      createdAt: createdAt.toISOString(),
      id,
      name,
      effect,
      isActive,
      updatedAt: updatedAt.toISOString(),
      deletedAt: deletedAt?.toISOString(),
    };
  }
  buildPermissionDetail(permission: Permission): PermissionDetail {
    return {
      ...permission,
      isActive: permission.isActive,
      createdAt: permission.createdAt.toISOString(),
      updatedAt: permission.updatedAt.toISOString(),
      deletedAt: permission.deletedAt?.toISOString() ?? null,
      resource: {
        ...permission.resource,
        createdAt: permission.createdAt.toISOString(),
        updatedAt: permission.updatedAt.toISOString(),
        deletedAt: permission.deletedAt?.toISOString() ?? null,
      },
      action: {
        ...permission.action,
        createdAt: permission.createdAt.toISOString(),
        updatedAt: permission.updatedAt.toISOString(),
        deletedAt: permission.deletedAt?.toISOString() ?? null,
      },
    };
  }

  async createPermission(
    data: PermissionCreateRequest,
    createdBy: string
  ): Promise<SimpleResponse> {
    const log = logger.child({
      method: 'createPermission',
      resource_key: data.resource_key,
      createdBy,
    });

    const result = await this.permissionRepo.create(data, { createdBy });

    log.info(`Permission "${result.name}" created by ${createdBy} successfully`);
    return {
      status: 'success',
      message: 'Permission created successfully',
    };
  }

  async getPermissionList(pagination: PermissionListRequest): Promise<PermissionListResponse> {
    const result = await this.permissionRepo.getPaginatedList(pagination, { withDeleted: true });

    return {
      status: 'success',
      message: 'Get permission list successful',
      data: {
        ...result,
        data: result.data.map(p => this.buildPermissionSummary(p)),
      },
    };
  }

  async getPermissionById(id: string): Promise<PermissionDetailResponse> {
    const permission = await this.permissionRepo.getById(id, {
      withDeleted: true,
      withRelations: true,
    });

    if (!permission) {
      throw new NotFoundError(`Permission id ${id} is not found`);
    }

    return {
      status: 'success',
      message: 'Get permission detail successful',
      data: this.buildPermissionDetail(permission),
    };
  }

  async updatePermission(
    id: string,
    data: PermissionUpdateRequest,
    updatedBy: string
  ): Promise<SimpleResponse> {
    const log = logger.child({ method: 'updatePermission', id, updatedBy });

    const permission = await this.permissionRepo.update(id, data, { updatedBy, withDeleted: true });

    log.info(`Permission "${permission.name}" updated by "${updatedBy}" successfully`);
    return {
      status: 'success',
      message: 'Permission updated successfully',
    };
  }

  async softDeletePermission(id: string, deletedBy: string): Promise<SimpleResponse> {
    const permission = await this.permissionRepo.softDelete(id, { deletedBy });

    return {
      status: 'success',
      message: `Permission "${permission.name}" has been soft-deleted`,
    };
  }

  async restorePermission(id: string, restoredBy: string): Promise<SimpleResponse> {
    const permission = await this.permissionRepo.restore(id, { restoredBy });

    return {
      status: 'success',
      message: `Permission "${permission.name}" has been restored`,
    };
  }

  async hardDeletePermission(id: string, deletedBy: string): Promise<SimpleResponse> {
    const permission = await this.permissionRepo.hardDelete(id, { deletedBy });

    return {
      status: 'success',
      message: `Permission "${permission.name}" has been permanently deleted`,
    };
  }

  async getPermissionOptionList(): Promise<PermissionOptionListResponse> {
    const permissions = await this.permissionRepo.getOptionList();
    return {
      status: 'success',
      message: 'Get permission options successful',
      data: permissions.map(p => ({
        id: p.id,
        name: p.name,
      })),
    };
  }
}
