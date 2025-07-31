import { createSuccessResponseSchema } from '../../../factories';
import { permissionSchema } from '../entity/schema';
import { zInfer } from '../../../libs/z';

export const permissionSingleResponseSchema = createSuccessResponseSchema(permissionSchema);

export type PermissionSingleResponse = zInfer<typeof permissionSingleResponseSchema>;
