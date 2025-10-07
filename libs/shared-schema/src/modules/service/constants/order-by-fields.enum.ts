import { z, zInfer } from '../../../libs/z';

export const SERVICE_ORDER_BY_FIELD = {
  SERVICE_ID: 'serviceId',
  NAME: 'name',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export const serviceOrderByFieldSchema = z.nativeEnum(SERVICE_ORDER_BY_FIELD);

export type ServiceOrderByField = zInfer<typeof serviceOrderByFieldSchema>;
