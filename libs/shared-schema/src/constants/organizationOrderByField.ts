export const OrganizationOrderByFieldsEnum = {
  NAME: 'name',
  ORG_TYPE_NAME: 'orgTypeName',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export type OrganizationOrderByField =
  (typeof OrganizationOrderByFieldsEnum)[keyof typeof OrganizationOrderByFieldsEnum];
