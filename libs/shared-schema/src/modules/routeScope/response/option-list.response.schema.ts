import { z, zInfer } from '../../../libs';
import { routeScopeRefSchema } from './ref.response.schema';
import { createSuccessResponseSchema } from '../../../factories';

export const routeScopeOptionSchema = routeScopeRefSchema;
export const routeScopeOptionListSchema = z.array(routeScopeOptionSchema);
export const routeScopeOptionListResponseSchema = createSuccessResponseSchema(
  routeScopeOptionListSchema
);

export type RouteScopeOption = zInfer<typeof routeScopeOptionSchema>;
export type RouteScopeOptionList = zInfer<typeof routeScopeOptionListSchema>;
export type RouteScopeOptionListResponse = zInfer<typeof routeScopeOptionListResponseSchema>;
