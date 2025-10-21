import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AuthService } from './auth.service';
import { loginRequestSchema, UserPayload } from '@frankjhub/shared-schema';

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

    res.status(200).json(result);
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
