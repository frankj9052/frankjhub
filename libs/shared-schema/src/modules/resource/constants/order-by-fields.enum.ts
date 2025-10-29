export const RESOURCE_ORDER_BY_FIELDS = {
  NAMESPACE: 'namespace',
  ENTITY: 'entity',
  QUALIFIER: 'qualifier',
  RESOURCE_KEY: 'resourceKey',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export type ResourceOrderByField =
  (typeof RESOURCE_ORDER_BY_FIELDS)[keyof typeof RESOURCE_ORDER_BY_FIELDS];
