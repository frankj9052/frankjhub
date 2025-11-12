import { createOffsetPaginationSchema } from '../../../factories/createOffsetPagination.schema';
import { zInfer } from '../../../libs/z';
import { ORGANIZATION_FILTER, ORGANIZATION_ORDER_BY_FIELDS } from '../constants';

export const organizationListRequestSchema = createOffsetPaginationSchema(
  ORGANIZATION_ORDER_BY_FIELDS,
  {
    status: ORGANIZATION_FILTER,
  }
);

export type OrganizationListRequest = zInfer<typeof organizationListRequestSchema>;
