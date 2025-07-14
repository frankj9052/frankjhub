import { verifyPassword } from './utils/password';
import { NotAuthorizedError } from '../common/errors/NotAuthorizedError';
import { createLoggerWithContext } from '../common/libs/logger';
import { User } from '../user/entities/User';
import AppDataSource from '../../config/data-source';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';
import { UserOrganizationRole } from '../organization/entities/UserOrganizationRole';
import { LoginRequest, LoginResponse, UserPayload } from '@frankjhub/shared-schema';

const logger = createLoggerWithContext('AuthService');

export class AuthService {
  private userRepo = AppDataSource.getRepository(User);
  private userOrgRoleRepo = AppDataSource.getRepository(UserOrganizationRole);

  private async buildUserPayload(user: User): Promise<UserPayload> {
    // 1. 查询用户在所有组织中的角色
    const orgRoles = await this.userOrgRoleRepo.find({
      where: { user: { id: user.id } },
      // relations: ['organization', 'role', 'organization.orgType'],
      relations: {
        organization: {
          orgType: true,
        },
        role: {
          rolePermissions: {
            permission: true,
          },
        },
      },
    });

    // 2. 构造最终 orgRoles[] 附带权限表达式
    const formattedOrgRoles = orgRoles.map(orgRole => ({
      orgId: orgRole.organization.id,
      orgName: orgRole.organization.name,
      orgType: orgRole.organization.orgType?.name || 'No Category',
      roleCode: orgRole.role.code,
      roleName: orgRole.role.name,
      permissionStrings: orgRole.role.rolePermissions?.map(rp => rp.permission.name) ?? [],
    }));

    return {
      id: user.id,
      email: user.email,
      userName: user.userName,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      profileCompleted: user.profileCompleted,
      orgRoles: formattedOrgRoles,
      sessionVersion: user.sessionVersion,
    };
  }
  async login(data: LoginRequest): Promise<LoginResponse> {
    const { email, password } = data;
    const log = logger.child({ method: 'login', email });
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user || !user.password) {
      log.warn(`User ${email} not exist`);
      throw new NotAuthorizedError('Invalid email or password');
    }

    const isMatch = await verifyPassword(user.password, password);

    if (!isMatch) {
      log.warn(`User ${email} password not match`);
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      log.warn(`User ${email} is disabled`);
      throw new UnauthorizedError('Account is disabled');
    }

    if (!user.emailVerified) {
      log.warn(`User ${email} email not verified`);
      throw new UnauthorizedError('Email not verified');
    }

    const payload = await this.buildUserPayload(user);

    log.info(`User ${user.userName} login successfully`);
    return {
      status: 'success',
      message: `User ${user.userName} login successfully`,
      data: payload,
    };
  }

  async getUserPayloadById(userId: string): Promise<UserPayload> {
    const log = logger.child({ method: 'getUserPayloadById', userId });

    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      log.warn(`User not found`);
      throw new NotAuthorizedError('User not found', { userId });
    }
    return this.buildUserPayload(user);
  }
}
