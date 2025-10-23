/** 固定 key（尽量少、核心的才放这里） */
export const RedisFixedKeys = {
  SNAPSHOT_LATEST: 'snapshot:lastest',
} as const;

/** 约定所有 redis key 的命名空间前缀 */
export const RedisNamespaces = {
  SNAPSHOT: 'snapshot',
  USER: 'user',
  ORG: 'org',
} as const;

/** Key 生成器：统一风格、便于重构 */
export const RedisKeys = {
  snapshotLatest(): string {
    return RedisFixedKeys.SNAPSHOT_LATEST;
  },
  snapshotByVersion(version: number | string): string {
    return `${RedisNamespaces.SNAPSHOT}:v:${version}`;
  },
  userSession(userId: string): string {
    return `${RedisNamespaces.USER}:session:${userId}`;
  },
  orgThrottle(orgId: string): string {
    return `${RedisNamespaces.ORG}:throttle:${orgId}`;
  },
} as const;

export type RedisKey =
  | (typeof RedisFixedKeys)[keyof typeof RedisFixedKeys]
  | ReturnType<(typeof RedisKeys)[keyof typeof RedisKeys]>;
