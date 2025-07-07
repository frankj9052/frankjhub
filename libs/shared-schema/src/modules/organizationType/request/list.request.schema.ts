import { zInfer } from '../../../libs/z';
import { createOffsetPaginationSchema } from '../../../factories';
import { ORGANIZATION_TYPE_FILTER } from '../constants/filter.enum';
import { ORGANIZATION_TYPE_ORDER_BY_FIELDS } from '../constants/order-by-fields.enum';

export const organizationTypeListRequestSchema = createOffsetPaginationSchema(
  ORGANIZATION_TYPE_FILTER,
  ORGANIZATION_TYPE_ORDER_BY_FIELDS
);

export type OrganizationTypeListRequest = zInfer<typeof organizationTypeListRequestSchema>;
