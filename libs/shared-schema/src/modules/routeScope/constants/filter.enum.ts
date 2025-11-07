import { createFiltersSchema } from '../../../factories/createFilters.schema';

export const ROUTE_SCOPE_STATUS_FILTER = {
  DELETED: 'deleted',
} as const;

export type RouteScopeStatusFilter =
  (typeof ROUTE_SCOPE_STATUS_FILTER)[keyof typeof ROUTE_SCOPE_STATUS_FILTER];

export const routeScopeFiltersSchema = createFiltersSchema({
  status: ROUTE_SCOPE_STATUS_FILTER,
});
