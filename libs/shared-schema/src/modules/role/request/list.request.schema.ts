import { zInfer } from '../../../libs/z';
import { createOffsetPaginationSchema } from '../../../factories/createOffsetPagination.schema';
import { ROLE_STATUS_FILTER, ROLE_ORDER_BY_FIELDS, ROLE_SOURCE_FILTER } from '../constants';

export const roleListRequestSchema = createOffsetPaginationSchema(ROLE_ORDER_BY_FIELDS, {
  status: ROLE_STATUS_FILTER,
  source: ROLE_SOURCE_FILTER,
});

export type RoleListRequest = zInfer<typeof roleListRequestSchema>;
