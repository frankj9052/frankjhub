import { createFiltersSchema } from '../../../factories/createFilters.schema';

export const SCOPE_STATUS_FILTER = {
  DELETED: 'deleted',
} as const;

export type ScopeStatusFilter = (typeof SCOPE_STATUS_FILTER)[keyof typeof SCOPE_STATUS_FILTER];

export const scopeFiltersSchema = createFiltersSchema({
  status: SCOPE_STATUS_FILTER,
});

export const scopeDynamicFilterKeys = ['resourceId'] as const;
