export const RESOURCE_ORDER_BY_FIELDS = {
  NAME: 'name',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export type ResourceOrderByField =
  (typeof RESOURCE_ORDER_BY_FIELDS)[keyof typeof RESOURCE_ORDER_BY_FIELDS];
