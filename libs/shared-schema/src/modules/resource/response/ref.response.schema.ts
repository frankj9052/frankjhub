import { createSuccessResponseSchema } from '../../../factories';
import { zInfer } from '../../../libs';
import { baseResourceSchema } from '../entity';

export const resourceRefSchema = baseResourceSchema.pick({
  id: true,
  resource_key: true,
});

export const resourceRefResponseSchema = createSuccessResponseSchema(resourceRefSchema);

export type ResourceRef = zInfer<typeof resourceRefSchema>;
export type ResourceRefResponse = zInfer<typeof resourceRefResponseSchema>;
