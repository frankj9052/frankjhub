import { createOffsetPaginationSchema } from '../../../factories';
import { USER_FILTER, USER_ORDER_BY_FIELDS } from '../constants';
import { zInfer } from '../../../libs/z';

export const userListRequestSchema = createOffsetPaginationSchema(USER_ORDER_BY_FIELDS, {
  status: USER_FILTER,
});

export type UserListRequest = zInfer<typeof userListRequestSchema>;
