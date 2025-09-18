import {
  createOffsetPaginatedResponseSchema,
  createSuccessResponseSchema,
} from '../../../factories';
import { invitationSchema } from '../entity';
import { invitationFiltersSchema } from '../constants/filter.enum';
import { zInfer } from '../../../libs/z';

export const invitationListPageDataSchema = createOffsetPaginatedResponseSchema(
  invitationSchema,
  invitationFiltersSchema
);

export const invitationListResponseSchema = createSuccessResponseSchema(
  invitationListPageDataSchema
);

export type InvitationListPageData = zInfer<typeof invitationListPageDataSchema>;

export type InvitationListResponse = zInfer<typeof invitationListResponseSchema>;
