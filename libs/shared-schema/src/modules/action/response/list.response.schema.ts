import { zInfer } from '../../../libs/z';
import { createOffsetPaginatedResponseSchema } from '../../../factories';
import { actionFilterListSchema } from '../constants';
import { actionSchema } from '../entity';

export const actionListResponseSchema = createOffsetPaginatedResponseSchema(
  actionSchema,
  actionFilterListSchema
);

export type ActionListResponse = zInfer<typeof actionListResponseSchema>;
