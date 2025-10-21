import { parsePermissionName } from './permissionCodec';

/**
 * 判断一个权限是否被 scope 授权（支持通配符）
 */
export function hasPermission(scopesFromJwt: string[], requiredPermission: string): boolean {
  const required = parsePermissionName(requiredPermission);

  for (const scope of scopesFromJwt) {
    try {
      const parsed = parsePermissionName(scope);

      // 1. 匹配资源
      const resourceMatches = parsed.resource === '*' || parsed.resource === required.resource;

      // 2. 匹配动作
      const actionMatches =
        parsed.actions === '*' ||
        (Array.isArray(parsed.actions) &&
          Array.isArray(required.actions) &&
          required.actions.every(act => parsed.actions.includes(act)));

      // 3. 匹配字段（类型安全）
      const parsedFields = parsed.fields;
      const requiredFields = required.fields;

      const fieldMatches =
        parsedFields === undefined ||
        parsedFields === '*' ||
        (Array.isArray(parsedFields) &&
          (requiredFields === undefined ||
            (Array.isArray(requiredFields) &&
              requiredFields.every(f => parsedFields.includes(f)))));

      if (resourceMatches && actionMatches && fieldMatches) {
        return true;
      }
    } catch {
      // 忽略非法 scope 字符串
    }
  }

  return false;
}
