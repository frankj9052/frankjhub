export const PERMISSION_ORDER_BY_FIELDS = {
  NAME: 'name',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export type PermissionOrderByField =
  (typeof PERMISSION_ORDER_BY_FIELDS)[keyof typeof PERMISSION_ORDER_BY_FIELDS];
