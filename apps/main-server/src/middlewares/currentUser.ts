import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../modules/auth/auth.service';
import { createLoggerWithContext } from '../modules/common/libs/logger';
import { verifyJwt } from '@frankjhub/shared-auth';
import { env } from '../config/env';

const logger = createLoggerWithContext('CurrentUserMiddleware');
const authService = new AuthService();
/**
 * currentUser 中间件
 *
 * 功能：
 * - 优先使用 express-session 还原用户
 * - 若无 session，则尝试从 Authorization: Bearer <token> 验证 JWT
 * - 验证通过后挂载 req.currentUser
 *
 * ⚠️ 注意：必须在 sessionMiddleware 之后注册本中间件！
 */
export const currentUser = async (req: Request, res: Response, next: NextFunction) => {
  // const sessionUser = req.session?.user as
  //   | {
  //       id: string;
  //       sessionVersion: string;
  //     }
  //   | undefined;

  // if (!sessionUser?.id || !sessionUser?.sessionVersion) {
  //   // logger.debug('No session user found. Skipping currentUser injection.');
  //   return next(); // 用户未登录，不挂载 currentUser
  // }

  try {
    /** =========================
     *  1️⃣ 优先使用 session
     * ========================= */
    const sessionUser = req.session?.user as { id: string; sessionVersion: string } | undefined;
    if (sessionUser?.id && sessionUser?.sessionVersion) {
      // 从数据库中查完整用户上下文（使用 authService 内部逻辑）
      const fullUser = await authService.getUserPayloadById(sessionUser.id);

      // 检查 sessionVersion 是否匹配（防止用旧权限）
      if (fullUser.sessionVersion !== sessionUser.sessionVersion) {
        logger.warn(`Session version mismatch for user ${sessionUser.id}`);
        // 清除旧 session
        req.session.destroy(() => {
          /* noop */
        });
        res.clearCookie('sid');
        return next();
      }
    }

    /** =========================
     *  2️⃣ 若没有 session，则尝试 JWT
     * ========================= */
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      // 没有 token，也没 session，直接放行（匿名用户）
      return next();
    }

    const token = authHeader.replace('Bearer ', '').trim();

    // 验证 JWT 签名
    const payload = await verifyJwt(token, 'main', env);

    // if(payload.type === 'user') {
    //   req.currentUser = {
    //     id: payload.id,
    //     userName: payload.userName,

    //   }
    // }

    // req.currentUser = fullUser;
    return next();
  } catch (error) {
    // 若用户不存在或查失败，仍继续流程（req.currentUser 保持 undefined）
    logger.warn(`Failed to build currentUser: ${error instanceof Error ? error.message : error}`);
    // 若 user 查不到，清除 session & cookie
    req.session.destroy(() => {
      /* noop */
    });
    res.clearCookie('sid');
    return next();
  }
};
