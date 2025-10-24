import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AuthService } from './auth.service';
import { loginRequestSchema, UserJwtPayload, UserPayload } from '@frankjhub/shared-schema';
import { ServiceTokenService } from '../service-auth/serviceToken.service';

const authService = new AuthService();

export const loginController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = loginRequestSchema.parse(req.body);
    const result = await authService.login(parsed);
    const userPayload: UserPayload = result.data;

    // 保存用户信息到 session
    req.session.user = {
      id: userPayload.id,
      email: userPayload.email,
      userName: userPayload.userName,
      roleCodes: userPayload.orgRoles.map(role => role.roleCode),
      permissionStrings: userPayload.orgRoles.flatMap(role => role.permissionStrings),
      sessionVersion: userPayload.sessionVersion, // 可用于强制刷新机制
    };

    // currentUser 立即挂载用于响应/中间件使用
    req.currentUser = userPayload;

    // 生成 JWT（可用于下游服务）
    const tokenPayload: UserJwtPayload = {
      id: userPayload.id,
      type: 'user',
      email: userPayload.email ?? '',
      emailVerified: userPayload.emailVerified,
      userName: userPayload.userName,
      orgRoles: userPayload.orgRoles,
      permissionStrings: userPayload.orgRoles.flatMap(r => r.permissionStrings.flatMap(p => p)),
      isActive: userPayload.isActive,
      profileCompleted: userPayload.profileCompleted,
      sessionVersion: userPayload.sessionVersion,
      aud: ['main'],
    };

    const jwt = await ServiceTokenService.signToken(tokenPayload);

    res.status(200).json({
      ...result,
      data: {
        ...result.data,
        token: jwt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController: RequestHandler = (req: Request, res: Response) => {
  const result = authService.logout(req, res);
  res.status(200).json(result);
};

export const currentUserController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.getCurrentUser(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
