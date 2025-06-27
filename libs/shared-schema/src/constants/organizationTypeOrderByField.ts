export const OrganizationTypeOrderByFieldsEnum = {
  NAME: 'name',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export type OrganizationTypeOrderByField =
  (typeof OrganizationTypeOrderByFieldsEnum)[keyof typeof OrganizationTypeOrderByFieldsEnum];
