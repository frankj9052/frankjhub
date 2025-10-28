import { zInfer } from '../../../libs/z';
import {
  createFiltersSchema,
  createOffsetPaginatedResponseSchema,
  createSuccessResponseSchema,
} from '../../../factories';
import { ACTION_STATUS_FILTER, ACTION_SYSTEM_FILTER } from '../constants';
import { actionSummarySchema } from './summary.response.schema';

export const actionListPageDataSchema = createOffsetPaginatedResponseSchema(
  actionSummarySchema,
  createFiltersSchema({
    status: ACTION_STATUS_FILTER,
    system: ACTION_SYSTEM_FILTER,
  })
);

export const actionListResponseSchema = createSuccessResponseSchema(actionListPageDataSchema);

export type ActionListPageData = zInfer<typeof actionListPageDataSchema>;
export type ActionListResponse = zInfer<typeof actionListResponseSchema>;
