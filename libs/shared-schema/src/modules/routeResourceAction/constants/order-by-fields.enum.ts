import { z, zInfer } from '../../../libs/z';

export const ROUTE_RESOURCE_ACTION_ORDER_BY_FIELD = {
  ACTION_NAME: 'actionName',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export const routeResourceActionOrderByFieldSchema = z.nativeEnum(
  ROUTE_RESOURCE_ACTION_ORDER_BY_FIELD
);
export type RouteResourceActionOrderByField = zInfer<typeof routeResourceActionOrderByFieldSchema>;
