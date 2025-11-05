import { z, zInfer } from '../../../libs';
import { routeResourceActionRefSchema } from './ref.response.schema';
import { createSuccessResponseSchema } from '../../../factories';

export const routeResourceActionOptionSchema = routeResourceActionRefSchema;
export const routeResourceActionOptionListSchema = z.array(routeResourceActionOptionSchema);
export const routeResourceActionOptionListResponseSchema = createSuccessResponseSchema(
  routeResourceActionOptionListSchema
);

export type RouteResourceActionOption = zInfer<typeof routeResourceActionOptionSchema>;
export type RouteResourceActionOptionList = zInfer<typeof routeResourceActionOptionListSchema>;
export type RouteResourceActionOptionListResponse = zInfer<
  typeof routeResourceActionOptionListResponseSchema
>;
