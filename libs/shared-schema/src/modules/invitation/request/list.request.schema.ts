import { createOffsetPaginationSchema } from '../../../factories';
import { INVITATION_ORDER_BY_FIELDS } from '../constants/order-by-fields.enum';
import { INVITATION_STATUS } from '../constants';
import { zInfer } from '../../../libs/z';

export const invitationListRequestSchema = createOffsetPaginationSchema(
  INVITATION_ORDER_BY_FIELDS,
  {
    status: INVITATION_STATUS,
  }
);

export type InvitationListRequest = zInfer<typeof invitationListRequestSchema>;
