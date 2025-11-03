import { z, zInfer } from '../../../libs/z';

export const SERVICE_ROUTE_ORDER_BY_FIELD = {
  SERVICE_ID: 'serviceId',
  PATH: 'path',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export const serviceRouteOrderByFieldSchema = z.nativeEnum(SERVICE_ROUTE_ORDER_BY_FIELD);
export type ServiceRouteOrderByField = zInfer<typeof serviceRouteOrderByFieldSchema>;
