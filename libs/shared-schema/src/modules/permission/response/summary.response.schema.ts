import { createSuccessResponseSchema } from '../../../factories/createSuccessResponse.schema';
import { permissionSchema } from '../entity/permission.schema';
import { zInfer } from '../../../libs';

export const permissionSummarySchema = permissionSchema.pick({
  id: true,
  name: true,
  effect: true,
  isActive: true,
  updatedAt: true,
  createdAt: true,
  deletedAt: true,
});

export const permissionSummaryResponseSchema = createSuccessResponseSchema(permissionSummarySchema);

export type PermissionSummary = zInfer<typeof permissionSummarySchema>;
export type PermissionSummaryResponse = zInfer<typeof permissionSummaryResponseSchema>;
