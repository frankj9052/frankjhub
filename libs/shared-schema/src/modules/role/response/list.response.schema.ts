import {
  createOffsetPaginatedResponseSchema,
  createSuccessResponseSchema,
} from '../../../factories';
import { roleSchema } from '../entity';
import { roleFiltersSchema } from '../constants';
import { zInfer } from '../../../libs/z';

export const roleListPageDataSchema = createOffsetPaginatedResponseSchema(
  roleSchema,
  roleFiltersSchema
);

export const roleListResponseSchema = createSuccessResponseSchema(roleListPageDataSchema);

export type RoleListPageData = zInfer<typeof roleListPageDataSchema>;
export type RoleListResponse = zInfer<typeof roleListResponseSchema>;
