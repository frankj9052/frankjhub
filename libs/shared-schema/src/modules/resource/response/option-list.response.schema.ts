import { z } from 'zod';
import { createSuccessResponseSchema } from '../../../factories';
import { zInfer } from '../../../libs/z';
import { resourceRefSchema } from './ref.response.schema';

export const resourceOptionSchema = resourceRefSchema;

export const resourceOptionListSchema = z.array(resourceOptionSchema);

export const resourceOptionListResponseSchema =
  createSuccessResponseSchema(resourceOptionListSchema);

export type ResourceOption = zInfer<typeof resourceOptionSchema>;

export type ResourceOptionList = zInfer<typeof resourceOptionListSchema>;

export type ResourceOptionListResponse = zInfer<typeof resourceOptionListResponseSchema>;
