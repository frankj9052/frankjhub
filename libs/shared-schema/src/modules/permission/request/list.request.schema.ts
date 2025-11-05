import { zInfer } from '../../../libs/z';
import { createOffsetPaginationSchema } from '../../../factories';
import { PERMISSION_ORDER_BY_FIELDS } from '../constants/order-by-fields.enum';
import { PERMISSION_FILTERS } from '../constants';

export const permissionListRequestSchema = createOffsetPaginationSchema(
  PERMISSION_ORDER_BY_FIELDS,
  PERMISSION_FILTERS
);

export type PermissionListRequest = zInfer<typeof permissionListRequestSchema>;
