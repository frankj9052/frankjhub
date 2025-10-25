import { createOffsetPaginationSchema } from '../../../factories';
import { qualifierSchema, RESOURCE_FILTER, RESOURCE_ORDER_BY_FIELDS } from '../constants';
import { z, zInfer } from '../../../libs/z';

export const resourceListRequestSchema = createOffsetPaginationSchema(
  RESOURCE_ORDER_BY_FIELDS,
  RESOURCE_FILTER
).extend({
  /** 精确筛选：归属服务（即 namespace = serviceId） */
  namespace: z.string().trim().min(1).optional(),

  /** 精确筛选：实体名（camel） */
  entity: z.string().trim().min(1).optional(),

  /** 精确筛选：限定符（'*' | ':id'），不传表示不限定 */
  qualifier: qualifierSchema.optional(),

  /** 按需展开（列表场景允许轻量展开 service） */
  expand: z.array(z.enum(['service'])).optional(),
});

export type ResourceListRequest = zInfer<typeof resourceListRequestSchema>;
