import { z, zInfer } from '../../../libs';
import { actionNameSchema } from '../../../modules/action';
import { baseEntitySchema } from '../../../modules/common';
import { idSchema } from '../../../modules/common/entity/id.schema';

export const routeResourceActionSchema = z.object({
  ...baseEntitySchema.shape,
  id: idSchema,
  routeId: idSchema,
  resourceId: idSchema,
  actionId: idSchema,
  actionName: actionNameSchema,
});

export type RouteResourceActionDto = zInfer<typeof routeResourceActionSchema>;
