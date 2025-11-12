import { createFiltersSchema } from '../../../factories';

export const ORGANIZATION_TYPE_STATUS_FILTER = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
} as const;

export const ORGANIZATION_TYPE_FILTERS = {
  status: ORGANIZATION_TYPE_STATUS_FILTER,
} as const;

export type OrganizationTypeStatusFilter =
  (typeof ORGANIZATION_TYPE_STATUS_FILTER)[keyof typeof ORGANIZATION_TYPE_STATUS_FILTER];

export const organizationTypeFiltersSchema = createFiltersSchema({
  status: ORGANIZATION_TYPE_STATUS_FILTER,
});
