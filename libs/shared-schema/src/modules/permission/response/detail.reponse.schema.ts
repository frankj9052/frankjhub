import { resourceSummarySchema } from '../../../modules/resource';
import { permissionSchema } from '../entity/permission.schema';
import { actionSummarySchema } from '../../../modules/action';
import { createSuccessResponseSchema } from '../../../factories/createSuccessResponse.schema';
import { zInfer } from '../../../libs/z';

export const permissionDetailSchema = permissionSchema.extend({
  resource: resourceSummarySchema,
  action: actionSummarySchema,
});

export const permissionDetailResponseSchema = createSuccessResponseSchema(permissionDetailSchema);

export type PermissionDetail = zInfer<typeof permissionDetailSchema>;
export type PermissionDetailResponse = zInfer<typeof permissionDetailResponseSchema>;
