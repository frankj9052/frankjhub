import {
  createOffsetPaginatedResponseSchema,
  createSuccessResponseSchema,
} from '../../../factories';
import { serviceSchema } from '../entities';
import { serviceFilterSchema } from '../constants';
import { zInfer } from '../../../libs/z';

export const serviceListPageDataSchema = createOffsetPaginatedResponseSchema(
  serviceSchema,
  serviceFilterSchema
);
export const serviceListResponseSchema = createSuccessResponseSchema(serviceListPageDataSchema);

export type ServiceListPageData = zInfer<typeof serviceListPageDataSchema>;
export type ServiceListResponse = zInfer<typeof serviceListResponseSchema>;
