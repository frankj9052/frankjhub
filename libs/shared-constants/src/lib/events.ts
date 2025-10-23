/** 事件名称（字符串字面量联合，IDE 友好、可枚举） */
export const SnapshotEvents = {
  SNAPSHOT_UPDATE: 'snapshot:update',
  SNAPSHOT_INVALIDATE: 'snapshot:invalidate',
} as const;
export type SnapshotEvent = (typeof SnapshotEvents)[keyof typeof SnapshotEvents];

/** 其他领域事件可以拆分文件或命名空间 */
export const UserEvents = {
  USER_CREATED: 'user:created',
  USER_DELETED: 'user:deleted',
} as const;
export type UserEvent = (typeof UserEvents)[keyof typeof UserEvents];

/**
 *  统一聚合导出：方便遍历、查找、类型提示
 */
export const AllEvents = {
  ...SnapshotEvents,
  ...UserEvents,
} as const;

/** 类型联合：适合 switch / 类型守卫 / 函数参数 */
export type EventName = (typeof AllEvents)[keyof typeof AllEvents];
