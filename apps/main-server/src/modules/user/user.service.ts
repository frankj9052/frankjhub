import { Not } from 'typeorm';
import AppDataSource from '../../config/data-source';
import { NotFoundError } from '../common/errors/NotFoundError';
import { createLoggerWithContext } from '../common/libs/logger';
import {
  UserProfilePayload,
  UserAllProfilePayload,
  UserPaginatedResponse,
  UserPaginationParams,
  UserAllProfileResponse,
  UserAdminUpdateSchema,
  SuccessResponse,
} from '@frankjhub/shared-schema';
import { User } from './entities/User';
import { paginateWithOffset } from '../common/utils/paginateWithOffset';
import { UserOrganizationRole } from '../organization/entities/UserOrganizationRole';

const logger = createLoggerWithContext('UserService');

const userFilterConditionMap: Record<string, string> = {
  active: `(t."is_active" = true AND t."deleted_at" IS NULL)`,
  inactive: `(t."is_active" = false AND t."deleted_at" IS NULL)`,
  deleted: `(t."deleted_at" IS NOT NULL)`,
  unverifiedEmail: `(t."email_verified" = false AND t."deleted_at" IS NULL)`,
  incompleteProfile: `(t."profile_completed" = false AND t."deleted_at" IS NULL)`,
};

export class UserService {
  private userRepo = AppDataSource.getRepository(User);
  private userOrgRoleRepo = AppDataSource.getRepository(UserOrganizationRole);
  async getCurrentUserInfo(id: string, email: string): Promise<UserProfilePayload> {
    const log = logger.child({ method: 'getCurrentUserDetail', email });
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      log.warn(`User id ${id} not exist`);
      throw new NotFoundError(`User with id ${id} not found`);
    }

    return this.buildUserProfile(user);
  }
  buildUserProfile(user: User): UserProfilePayload {
    return {
      userName: user.userName,
      email: user.email ?? null,
      lastName: user.lastName,
      firstName: user.firstName,
      middleName: user.middleName ?? null,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth.toISOString(),
      honorific: user.honorific,
      oauthProvider: user.oauthProvider ?? null,
      avatarImage: user.avatarImage,
    };
  }
  buildUserAllProfile(user: User): UserAllProfilePayload {
    return {
      id: user.id,
      userName: user.userName,
      email: user.email ?? null,

      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName ?? null,

      gender: user.gender ?? null,
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString() : null,
      honorific: user.honorific ?? null,

      avatarImage: user.avatarImage ?? null,

      // OAuth 信息
      oauthProvider: user.oauthProvider ?? null,
      oauthId: user.oauthId ?? null,

      // 安全认证相关
      emailVerified: user.emailVerified,
      profileCompleted: user.profileCompleted,
      refreshToken: user.refreshToken ?? null,
      sessionVersion: user.sessionVersion,

      // 状态控制
      isActive: user.isActive,

      // 时间戳
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      deletedAt: user.deletedAt?.toISOString() ?? null,
      createdBy: user.createdBy ?? null,
      updatedBy: user.updatedBy ?? null,
      deletedBy: user.deletedBy ?? null,
    };
  }

  async getUsersAllProfile(
    email: string,
    pagination: UserPaginationParams
  ): Promise<UserPaginatedResponse> {
    const paginatedUsers = await paginateWithOffset({
      repo: this.userRepo,
      where: { email: Not(email) },
      pagination,
      modifyQueryBuilder: qb => {
        const { search, filters } = pagination;

        // 搜索条件
        if (search) {
          qb.andWhere(
            `(t.userName ILIKE :search OR t.email ILIKE :search OR t.lastName ILIKE :search OR t.firstName ILIKE :search)`,
            { search: `%${search.trim()}%` }
          );
        }

        // 态筛选（支持多选 OR 组合）
        if (filters?.length) {
          const validConditions = filters
            .map(status => userFilterConditionMap[status])
            .filter(Boolean);

          if (validConditions.length > 0) {
            qb.andWhere(`(${validConditions.join(' OR ')})`);
          }
        }
        return qb.withDeleted();
      },
    });
    const response: UserPaginatedResponse = {
      ...paginatedUsers,
      data: paginatedUsers.data.map(user => this.buildUserAllProfile(user)),
    } as UserPaginatedResponse;
    return response;
  }

  async getUserAllProfileById(id: string): Promise<UserAllProfileResponse> {
    const log = logger.child({ method: 'getUserAllProfileById', id });
    const user = await this.userRepo.findOne({
      where: {
        id,
      },
      withDeleted: true,
    });
    if (!user) {
      log.warn(`User id ${id} not exist`);
      throw new NotFoundError(`User with id ${id} not found`);
    }
    const response: UserAllProfileResponse = {
      data: this.buildUserAllProfile(user),
      status: 'success',
    };
    return response;
  }

  async softDeleteUser(id: string, performedBy: string): Promise<SuccessResponse> {
    const log = logger.child({ method: 'softDeleteUserById', id });
    await this.userRepo.update(
      { id },
      {
        deletedAt: new Date().toISOString(),
        deletedBy: performedBy,
      }
    );
    log.info(`User soft-deleted by ${performedBy}`);
    return {
      status: 'success',
      message: `User soft-deleted by ${performedBy}`,
    };
  }

  async restoreSoftDeletedUser(id: string, performedBy: string): Promise<SuccessResponse> {
    const log = logger.child({ method: 'restoreSoftDeletedUser', id, performedBy });

    const user = await this.userRepo.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!user) {
      log.warn(`User ${id} not found when attempting to restore`);
      throw new NotFoundError('User not found');
    }

    if (user.deletedAt === null) {
      log.info(`User ${id} is not deleted, no need to restore`);
      return {
        status: 'success',
        message: `User ${id} is not deleted, no need to restore`,
      };
    }

    await this.userRepo.update(
      { id },
      {
        deletedAt: null,
        deletedBy: null,
      }
    );
    log.info(`User ${id} restored by ${performedBy}`);
    return {
      status: 'success',
      message: `User ${id} restored by ${performedBy}`,
    };
  }

  async hardDeleteUser(id: string, performedBy: string): Promise<SuccessResponse> {
    const log = logger.child({ method: 'hardDeleteUser', id, performedBy });
    try {
      const user = await this.userRepo.findOne({
        where: { id },
        relations: ['userOrganizationRoles'],
        withDeleted: true,
      });
      if (!user) {
        log.warn(`User ${id} not found for hard deletion.`);
        throw new NotFoundError('User id not found');
      }
      // 因为user中没有写关系，手动加关联
      const userOrganizationRoles = await this.userOrgRoleRepo.findBy({ user: { id } });
      (user as any).userOrganizationRoles = userOrganizationRoles;
      await this.userRepo.remove(user);
      return {
        status: 'success',
        message: `User ${id} has been permanently deleted.`,
      };
    } catch (error) {
      log.error(`Failed to hard delete user ${id}`);
      throw error;
    }
  }

  async updateUserByAdmin(
    data: UserAdminUpdateSchema,
    performedBy: string
  ): Promise<SuccessResponse> {
    const { id } = data;
    const log = logger.child({ method: 'updateUserByAdmin', id, performedBy });
    const user = await this.userRepo.findOne({ where: { id }, withDeleted: true });
    if (!user) {
      log.warn(`User ${id} not found for admin update`);
      throw new NotFoundError('User not found');
    }

    for (const [key, value] of Object.entries(data)) {
      if (key === 'id') continue;
      if (value !== undefined) {
        (user as any)[key] = value;
      }
    }

    await this.userRepo.save(user);
    log.info(`User ${id} updated by ${performedBy}`);
    return {
      status: 'success',
      message: `User ${id} updated by ${performedBy}`,
    };
  }
}
