import {
  createOffsetPaginatedResponseSchema,
  createSuccessResponseSchema,
} from '../../../factories';
import { resourceFilterListSchema } from '../constants';
import { zInfer } from '../../../libs/z';
import { resourceDetailSchema } from './detail.response.schema';

export const resourceListPageDataSchema = createOffsetPaginatedResponseSchema(
  resourceDetailSchema,
  resourceFilterListSchema
);

export const resourceListResponseSchema = createSuccessResponseSchema(resourceListPageDataSchema);

export type ResourceListPageData = zInfer<typeof resourceListPageDataSchema>;

export type ResourceListResponse = zInfer<typeof resourceListResponseSchema>;
