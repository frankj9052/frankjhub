import {
  createOffsetPaginatedResponseSchema,
  createSuccessResponseSchema,
} from '../../../factories';
import { resourceSchema } from '../entity';
import { resourceFilterListSchema } from '../constants';
import { zInfer } from '../../../libs/z';

export const resourceListPageDataSchema = createOffsetPaginatedResponseSchema(
  resourceSchema,
  resourceFilterListSchema
);

export const resourceListResponseSchema = createSuccessResponseSchema(resourceListPageDataSchema);

export type ResourceListPageData = zInfer<typeof resourceListPageDataSchema>;

export type ResourceListResponse = zInfer<typeof resourceListResponseSchema>;
