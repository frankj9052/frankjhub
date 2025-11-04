import { z, zInfer } from '../../../libs/z';

export const SCOPE_ORDER_BY_FIELDS = {
  ACTION_NAME: 'actionName',
  KEY: 'key',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export const scopeOrderByFieldSchema = z.nativeEnum(SCOPE_ORDER_BY_FIELDS);
export type ScopeOrderByField = zInfer<typeof scopeOrderByFieldSchema>;
