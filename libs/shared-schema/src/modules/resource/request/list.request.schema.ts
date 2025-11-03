import { createOffsetPaginationSchema } from '../../../factories';
import { RESOURCE_STATUS_FILTER, RESOURCE_ORDER_BY_FIELDS } from '../constants';
import { zInfer } from '../../../libs/z';

export const resourceListRequestSchema = createOffsetPaginationSchema(RESOURCE_ORDER_BY_FIELDS, {
  status: RESOURCE_STATUS_FILTER,
});

export type ResourceListRequest = zInfer<typeof resourceListRequestSchema>;
