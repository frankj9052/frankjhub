import { zInfer } from '../../../libs/z';
import { createOffsetPaginationSchema } from '../../../factories';
import { ACTION_FILTER } from '../constants/filter.enum';
import { ACTION_ORDER_BY_FIELDS } from '../constants/order-by-fields.enum';

export const actionListRequestSchema = createOffsetPaginationSchema(
  ACTION_ORDER_BY_FIELDS,
  ACTION_FILTER
);

export type ActionListRequest = zInfer<typeof actionListRequestSchema>;
