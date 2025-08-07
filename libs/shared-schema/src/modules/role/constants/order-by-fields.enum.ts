export const ROLE_ORDER_BY_FIELDS = {
  NAME: 'name',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export type RoleOrderByFields = (typeof ROLE_ORDER_BY_FIELDS)[keyof typeof ROLE_ORDER_BY_FIELDS];
