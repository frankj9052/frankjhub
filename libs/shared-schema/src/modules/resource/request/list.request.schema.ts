import { createOffsetPaginationSchema } from '../../../factories';
import { RESOURCE_FILTER, RESOURCE_ORDER_BY_FIELDS } from '../constants';
import { zInfer } from '../../../libs/z';

export const resourceListRequestSchema = createOffsetPaginationSchema(
  RESOURCE_ORDER_BY_FIELDS,
  RESOURCE_FILTER
);

export type ResourceListRequest = zInfer<typeof resourceListRequestSchema>;
