import { zInfer } from '../../../libs/z';
import {
  createOffsetPaginatedResponseSchema,
  createSuccessResponseSchema,
} from '../../../factories';
import { actionFilterListSchema } from '../constants';
import { actionSchema } from '../entity';

export const actionListPageDataSchema = createOffsetPaginatedResponseSchema(
  actionSchema,
  actionFilterListSchema
);

export const actionListResponseSchema = createSuccessResponseSchema(actionListPageDataSchema);

export type ActionListPageData = zInfer<typeof actionListPageDataSchema>;
export type ActionListResponse = zInfer<typeof actionListResponseSchema>;
