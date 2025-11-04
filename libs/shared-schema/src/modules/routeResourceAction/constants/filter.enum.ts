import { createFiltersSchema } from '../../../factories/createFilters.schema';

export const ROUTE_RESOURCE_ACTION_STATUS_FILTER = {
  DELETED: 'deleted',
} as const;

export type RouteResourceActionStatusFilter =
  (typeof ROUTE_RESOURCE_ACTION_STATUS_FILTER)[keyof typeof ROUTE_RESOURCE_ACTION_STATUS_FILTER];

export const routeResourceActionFiltersSchema = createFiltersSchema({
  status: ROUTE_RESOURCE_ACTION_STATUS_FILTER,
});

export const routeResourceActionDynamicFilterKeys = ['routeId', 'resourceId'] as const;
