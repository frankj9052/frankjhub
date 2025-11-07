import { createFiltersSchema } from '../../../factories';

export const SERVICE_ROUTE_STATUS_FILTER = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
} as const;

export type ServiceRouteStatusFilter =
  (typeof SERVICE_ROUTE_STATUS_FILTER)[keyof typeof SERVICE_ROUTE_STATUS_FILTER];

export const serviceRouteFiltersSchema = createFiltersSchema({
  status: SERVICE_ROUTE_STATUS_FILTER,
});

export const serviceRouteDynamicFilterKeys = ['serviceId'] as const;
