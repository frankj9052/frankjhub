import { createOffsetPaginationSchema } from '../../../factories/createOffsetPagination.schema';
import { ROLE_PERMISSION_ORDER_BY_FIELD, ROLE_PERMISSION_STATUS_FILTER } from '../constants';
import { zInfer } from '../../../libs/z';

export const rolePermissionListRequestSchema = createOffsetPaginationSchema(
  ROLE_PERMISSION_ORDER_BY_FIELD,
  {
    status: ROLE_PERMISSION_STATUS_FILTER,
  }
);

export type RolePermissionListRequest = zInfer<typeof rolePermissionListRequestSchema>;
