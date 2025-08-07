import { zInfer } from '../../../libs/z';
import { createOffsetPaginationSchema } from '../../../factories/createOffsetPagination.schema';
import { ROLE_FILTER, ROLE_ORDER_BY_FIELDS } from '../constants';

export const roleListRequestSchema = createOffsetPaginationSchema(
  ROLE_ORDER_BY_FIELDS,
  ROLE_FILTER
);

export type RoleListRequest = zInfer<typeof roleListRequestSchema>;
