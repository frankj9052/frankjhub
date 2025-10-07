import { createFiltersSchema } from '../../../factories';

export const SERVICE_FILTER = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
} as const;

export const serviceFilterSchema = createFiltersSchema({
  status: SERVICE_FILTER,
});

export type ServiceStatus = (typeof SERVICE_FILTER)[keyof typeof SERVICE_FILTER];
