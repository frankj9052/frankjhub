import { zInfer } from '../../../libs/z';
import {
  createOffsetPaginatedResponseSchema,
  createSuccessResponseSchema,
} from '../../../factories';
import { permissionFilterListSchema } from '../constants/filter.enum';
import { permissionSchema } from '../entity/schema';

export const permissionListPageDataSchema = createOffsetPaginatedResponseSchema(
  permissionSchema,
  permissionFilterListSchema
);

export const permissionListResponseSchema = createSuccessResponseSchema(
  permissionListPageDataSchema
);

export type PermissionListPageData = zInfer<typeof permissionListPageDataSchema>;
export type PermissionListResponse = zInfer<typeof permissionListResponseSchema>;
