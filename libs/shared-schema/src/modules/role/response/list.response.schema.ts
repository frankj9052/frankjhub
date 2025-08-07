import {
  createOffsetPaginatedResponseSchema,
  createSuccessResponseSchema,
} from '../../../factories';
import { roleSchema } from '../entity';
import { roleFilterListSchema } from '../constants';
import { zInfer } from '../../../libs/z';

export const roleListPageDataSchema = createOffsetPaginatedResponseSchema(
  roleSchema,
  roleFilterListSchema
);

export const roleListResponseSchema = createSuccessResponseSchema(roleListPageDataSchema);

export type RoleListPageData = zInfer<typeof roleListPageDataSchema>;
export type RoleListResponse = zInfer<typeof roleListResponseSchema>;
