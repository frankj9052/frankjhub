import { createSuccessResponseSchema } from '../../../factories';
import { z, zInfer } from '../../../libs/z';
import { roleSchema } from '../entity';

export const roleOptionSchema = roleSchema.pick({
  id: true,
  name: true,
  code: true,
});

export const roleOptionListSchema = z.array(roleOptionSchema);

export const roleOptionListResponseSchema = createSuccessResponseSchema(roleOptionListSchema);

export type RoleOption = zInfer<typeof roleOptionSchema>;
export type RoleOptionList = zInfer<typeof roleOptionListSchema>;
export type RoleOptionListResponse = zInfer<typeof roleOptionListResponseSchema>;
