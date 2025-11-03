import { createOffsetPaginationSchema } from '../../../factories';
import { SERVICE_STATUS_FILTER, SERVICE_ORDER_BY_FIELD } from '../constants';
import { zInfer } from '../../../libs/z';

export const serviceListRequestSchema = createOffsetPaginationSchema(SERVICE_ORDER_BY_FIELD, {
  status: SERVICE_STATUS_FILTER,
});

export type ServiceListRequest = zInfer<typeof serviceListRequestSchema>;
