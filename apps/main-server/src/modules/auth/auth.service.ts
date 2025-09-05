import { verifyPassword } from './utils/password';
import { NotAuthorizedError } from '../common/errors/NotAuthorizedError';
import { createLoggerWithContext } from '../common/libs/logger';
import { User } from '../user/entities/User';
import AppDataSource from '../../config/data-source';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';
import { UserOrganizationRole } from '../userOrganizationRole/entities/UserOrganizationRole';
import {
  BaseResponse,
  GetCurrentUserResponse,
  LoginRequest,
  LoginResponse,
  UserPayload,
} from '@frankjhub/shared-schema';
import { Request, Response } from 'express';
import { env } from '../../config/env';
import { CookieOptions } from 'express-session';

const logger = createLoggerWithContext('AuthService');
const isProd = env.NODE_ENV === 'production';
const clearOpts = {
  path: '/',
  sameSite: (env.SESSION_COOKIE_SAMESITE as CookieOptions['sameSite']) ?? 'lax',
  secure: isProd,
  httpOnly: true,
  domain: env.SESSION_COOKIE_DOMAIN,
};
const cookieName = env.SESSION_COOKIE_NAME ?? 'sid';

export class AuthService {
  private userRepo = AppDataSource.getRepository(User);
  private userOrgRoleRepo = AppDataSource.getRepository(UserOrganizationRole);

  private async buildUserPayload(user: User): Promise<UserPayload> {
    // 1. 查询用户在所有组织中的角色
    const orgRoles = await this.userOrgRoleRepo.find({
      where: { user: { id: user.id }, isActive: true },
      withDeleted: false,
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
      permissionStrings: orgRole.role?.rolePermissions?.map(rp => rp.permission.name) ?? [],
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

  logout(req: Request, res: Response): BaseResponse {
    const log = logger.child({ method: 'logout', userId: req.session?.user?.id });
    // 始终先清浏览器 Cookie（幂等）
    res.clearCookie(cookieName, clearOpts);
    // 再销毁服务端会话（容错：没有也算成功）
    if (req.session) {
      // 保留当前 sessionID 以防后续需要 store.destroy
      const sid = req.sessionID;
      req.session.destroy(err => {
        if (err) {
          // 记录错误，但不影响返回；Cookie 已清，前端状态不会卡住
          log.error('Session destroy failed', err, { sid });
        }
      });
    }
    return {
      status: 'success',
      message: 'Logout successful',
    };
  }

  async getCurrentUser(req: Request): Promise<GetCurrentUserResponse> {
    const user = req.currentUser;
    if (!user) {
      return null;
    }
    return {
      status: 'success',
      message: 'get current user successful',
      data: user,
    };
  }
}
