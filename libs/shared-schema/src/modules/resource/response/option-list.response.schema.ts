import { z } from 'zod';
import { resourceSchema } from '../entity';
import { createSuccessResponseSchema } from '../../../factories';
import { zInfer } from '../../../libs/z';

export const resourceOptionSchema = resourceSchema.pick({
  id: true,
  name: true,
});

export const resourceOptionListSchema = z.array(resourceOptionSchema);

export const resourceOptionListResponseSchema =
  createSuccessResponseSchema(resourceOptionListSchema);

export type ResourceOption = zInfer<typeof resourceOptionSchema>;

export type ResourceOptionList = zInfer<typeof resourceOptionListSchema>;

export type ResourceOptionListResponse = zInfer<typeof resourceOptionListResponseSchema>;
