import { zInfer } from '../../../libs/z';
import { createOffsetPaginationSchema } from '../../../factories';
import { PERMISSION_FILTER } from '../constants/filter.enum';
import { PERMISSION_ORDER_BY_FIELDS } from '../constants/order-by-fields.enum';

export const permissionListRequestSchema = createOffsetPaginationSchema(
  PERMISSION_ORDER_BY_FIELDS,
  PERMISSION_FILTER
);

export type PermissionListRequest = zInfer<typeof permissionListRequestSchema>;
