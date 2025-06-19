import { UserPayload } from '@frankjhub/shared-schema';

/**
 * 提取用户在所有组织角色中的权限字符串（扁平化）
 *
 * 在本系统中，权限以结构化字符串形式表示，例如：
 *   user:[read,update]@name,email?orgId=123
 *
 * 每个用户可以在多个组织（orgRoles）中拥有不同的角色与权限，
 * 本函数将所有角色中的 `permissionStrings` 合并为一个扁平数组，
 * 用于后续权限判断（如 `hasPermission` 中的匹配逻辑）。
 *
 * @param currentUser 当前登录用户对象（可为空）
 * @returns 权限字符串数组（如：['user:[read]@name', 'appointment:[create]']）
 */
export function extractUserPermissionStrings(currentUser: UserPayload | undefined): string[] {
  return currentUser?.orgRoles.flatMap(r => r.permissionStrings) ?? [];
}
