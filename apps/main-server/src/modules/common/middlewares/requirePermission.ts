import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { hasPermission } from '../../permission/utils/hasPermission';
import { extractUserPermissionStrings } from '../../permission/utils/extractUserPermissionStrings';

/**
 * Middleware: Require a single permission to access a route.
 *
 * This checks if the current user has a permission string that satisfies
 * the required permission based on wildcard-aware matching rules.
 *
 * @param requiredPermission A permission string (e.g., 'user:[read]@email')
 * @returns Express middleware that throws UnauthorizedError if the permission is missing
 */
export const requirePermission = (requiredPermission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userPermissions = extractUserPermissionStrings(req.currentUser);

    if (!hasPermission(userPermissions, requiredPermission)) {
      return next(
        new UnauthorizedError(`Access denied: Missing permission "${requiredPermission}".`)
      );
    }

    next();
  };
};

/**
 * Middleware: Require at least one of the given permissions.
 *
 * The current user is granted access if **any one** of the provided permissions matches
 * against their permission list using wildcard-aware matching.
 *
 * @param allowedPermissions An array of permission strings
 * @returns Express middleware that throws UnauthorizedError if none match
 */
export const requireAnyPermissions = (...allowedPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userPermissions = extractUserPermissionStrings(req.currentUser);

    const matched = allowedPermissions.some(required => hasPermission(userPermissions, required));

    if (!matched) {
      return next(
        new UnauthorizedError(
          `Access denied: Requires any of the permissions [${allowedPermissions.join(', ')}].`
        )
      );
    }

    next();
  };
};

/**
 * Middleware: Require all specified permissions to access the route.
 *
 * This checks whether the current user has **every** permission in the list,
 * using wildcard-aware permission matching logic.
 *
 * @param requiredPermissions An array of permission strings
 * @returns Express middleware that throws UnauthorizedError if any required permission is missing
 */
export const requireAllPermissions = (...requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userPermissions = extractUserPermissionStrings(req.currentUser);

    const allSatisfied = requiredPermissions.every(required =>
      hasPermission(userPermissions, required)
    );

    if (!allSatisfied) {
      return next(
        new UnauthorizedError(
          `Access denied: Requires all of the permissions [${requiredPermissions.join(', ')}].`
        )
      );
    }

    next();
  };
};
