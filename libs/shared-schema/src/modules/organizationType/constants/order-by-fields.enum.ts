export const ORGANIZATION_TYPE_ORDER_BY_FIELDS = {
  NAME: 'name',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export type OrganizationTypeOrderByField =
  (typeof ORGANIZATION_TYPE_ORDER_BY_FIELDS)[keyof typeof ORGANIZATION_TYPE_ORDER_BY_FIELDS];
