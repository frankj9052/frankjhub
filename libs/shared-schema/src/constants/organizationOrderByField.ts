export const OrganizationOrderByFieldsEnum = {
  NAME: 'name',
  ORG_TYPE: 'orgType',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export type OrganizationOrderByField =
  (typeof OrganizationOrderByFieldsEnum)[keyof typeof OrganizationOrderByFieldsEnum];
