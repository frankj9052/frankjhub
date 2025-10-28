import { zInfer } from '../../../libs/z';
import { createOffsetPaginationSchema } from '../../../factories';
import { ACTION_ORDER_BY_FIELDS } from '../constants/order-by-fields.enum';
import { ACTION_STATUS_FILTER, ACTION_SYSTEM_FILTER } from '../constants';

export const actionListRequestSchema = createOffsetPaginationSchema(ACTION_ORDER_BY_FIELDS, {
  status: ACTION_STATUS_FILTER,
  system: ACTION_SYSTEM_FILTER,
});

export type ActionListRequest = zInfer<typeof actionListRequestSchema>;
