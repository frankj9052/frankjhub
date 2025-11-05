import { zInfer } from '../../../libs/z';
import {
  createOffsetPaginatedResponseSchema,
  createSuccessResponseSchema,
} from '../../../factories';
import { permissionFiltersSchema } from '../constants';
import { permissionSummarySchema } from './summary.response.schema';

export const permissionListPageDataSchema = createOffsetPaginatedResponseSchema(
  permissionSummarySchema,
  permissionFiltersSchema
);

export const permissionListResponseSchema = createSuccessResponseSchema(
  permissionListPageDataSchema
);

export type PermissionListPageData = zInfer<typeof permissionListPageDataSchema>;
export type PermissionListResponse = zInfer<typeof permissionListResponseSchema>;
