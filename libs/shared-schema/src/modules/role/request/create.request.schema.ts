import { z, zInfer } from '../../../libs/z';
import { roleSchema } from '../entity';

export const roleCreateRequestSchema = roleSchema
  .pick({
    name: true,
    description: true,
    roleSource: true,
  })
  .extend({
    sourceId: z.string().uuid(),
    permissionIds: z.array(z.string().uuid()),
  });

export type RoleCreateRequest = zInfer<typeof roleCreateRequestSchema>;
