export const ORGANIZATION_ORDER_BY_FIELDS = {
  NAME: 'name',
  ORG_TYPE_NAME: 'orgTypeName',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export type OrganizationOrderByField =
  (typeof ORGANIZATION_ORDER_BY_FIELDS)[keyof typeof ORGANIZATION_ORDER_BY_FIELDS];
