import { z, zInfer } from '../../../libs/z';

export const ROUTE_SCOPE_ORDER_BY_FIELD = {
  SCOPEKEY: 'scopeKey',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export const routeScopeOrderByFieldSchema = z.nativeEnum(ROUTE_SCOPE_ORDER_BY_FIELD);
export type RouteScopeOrderByField = zInfer<typeof routeScopeOrderByFieldSchema>;
