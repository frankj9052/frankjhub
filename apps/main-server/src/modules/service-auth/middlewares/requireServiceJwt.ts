import { Request, Response, NextFunction } from 'express';
import { verifyServiceJwt } from '../utils/verifyWithJwks';
import { UnauthorizedError } from '../../common/errors/UnauthorizedError';
import { createLoggerWithContext } from '../../common/libs/logger';
import { hasPermission } from '../../permission/utils/hasPermission';

const logger = createLoggerWithContext('requireServiceJwt');

/**
 * 中间件：验证来自其他服务的 JWT
 *
 * - 动态识别调用方服务（从请求头 x-service-name 读取）
 * - 验证 JWT 是否有效、是否具备所需 scopes
 *
 * @param requiredScopes 要求的权限作用域
 */
export const requireServiceJwt = (requiredScopes: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const callerService = req.headers['x-service-name']?.toString().trim();

    // 检查 Bearer Token 是否存在
    if (!authHeader?.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Missing Bearer token'));
    }

    // 检查调用方服务名称
    if (!callerService) {
      return next(new UnauthorizedError('Missing x-service-name header'));
    }

    const token = authHeader.replace('Bearer ', '').trim();

    try {
      // 动态校验 JWT（基于 callerService 对应的 public key）
      const payload = await verifyServiceJwt(token, callerService);

      // 检查 header 与 token 中的 serviceId 一致性（防止伪造）
      if (payload.serviceId !== callerService) {
        logger.warn(
          `❌ Mismatched service identity: token claims "${payload.serviceId}", header "x-service-name" = "${callerService}"`
        );
        return next(new UnauthorizedError('Service identity mismatch'));
      }

      // 校验所需权限作用域
      const missingScopes = requiredScopes.filter(
        required => !hasPermission(payload.scopes, required)
      );

      if (missingScopes.length > 0) {
        return next(new UnauthorizedError(`Missing scopes: ${missingScopes.join(', ')}`));
      }

      // 写入 req，供后续中间件或控制器使用
      req.serviceAuth = {
        serviceId: payload.serviceId,
        scopes: payload.scopes,
      };

      next();
    } catch (error) {
      logger.error(`JWT error for service "${callerService}"`, error);
      return next(new UnauthorizedError('Invalid or expired service token'));
    }
  };
};
