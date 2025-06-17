// 这个函数弃用，用permission来判断
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError';

/**
 * Middleware: Checks whether the current user has the specified role code.
 *
 * This middleware ensures that the user has a specific role assigned,
 * typically used to enforce fine-grained access control for routes that require
 * a unique role (e.g., `org|abc123::admin`).
 *
 * @param requiredRole - A single role code the user must possess (e.g., 'org|abc123::admin')
 * @returns Express middleware that throws `UnauthorizedError` if the user does not have the role
 */
export const requireRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles = req.currentUser?.orgRoles ?? [];
    const userId = req.currentUser?.id ?? 'unknown';

    const hasRole = userRoles.some(ur => ur.roleCode === requiredRole);

    if (!hasRole) {
      return next(
        new UnauthorizedError(`User ${userId} is not authorized. Required role: ${requiredRole}`)
      );
    }

    next();
  };
};

/**
 * Middleware: Checks whether the current user has at least one of the specified role codes.
 *
 * This is typically used to protect routes that require specific roles (e.g., `org|123::admin`).
 * The middleware inspects the user's assigned roles across organizations and grants access
 * if any of the `allowedRoles` match.
 *
 * @param requireRoles - An array of role codes (e.g., ['org|123::admin', 'type|clinic::doctor'])
 * @returns Express middleware that throws `UnauthorizedError` if no matching role is found
 */
export const requireAnyRole = (...allownedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles = req.currentUser?.orgRoles ?? [];
    const userId = req.currentUser?.id ?? 'unknown';
    const hasAny = allownedRoles.some(code => userRoles.some(ur => ur.roleCode === code));

    if (!hasAny) {
      return next(
        new UnauthorizedError(
          `User ${userId} is not authorized. Required any of: [${allownedRoles.join(', ')}]`
        )
      );
    }
    next();
  };
};

/**
 * Middleware: Checks whether the current user has all of the specified role codes.
 *
 * This middleware is used to enforce access control when a user must possess **every**
 * role in the list of `requiredRoles`—for example, both `org|123::admin` and `type|clinic::editor`.
 *
 * @param requiredRoles - An array of role codes the user must possess
 * @returns Express middleware that throws `UnauthorizedError` if any role is missing
 */
export const requireAllRoles = (...requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles = req.currentUser?.orgRoles ?? [];
    const userId = req.currentUser?.id ?? 'unknown';

    const userRoleCodes = userRoles.map(role => role.roleCode);
    const hasAll = requiredRoles.every(code => userRoleCodes.includes(code));

    if (!hasAll) {
      const missing = requiredRoles.filter(code => !userRoleCodes.includes(code));
      return next(
        new UnauthorizedError(
          `User ${userId} is not authorized. Missing required roles: [${missing.join(', ')}]`
        )
      );
    }

    next();
  };
};
