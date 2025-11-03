import { createFiltersSchema } from '../../../factories';

export const SERVICE_STATUS_FILTER = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
} as const;

export const serviceStatusFilterSchema = createFiltersSchema({
  status: SERVICE_STATUS_FILTER,
});

export type ServiceStatusFilter =
  (typeof SERVICE_STATUS_FILTER)[keyof typeof SERVICE_STATUS_FILTER];
