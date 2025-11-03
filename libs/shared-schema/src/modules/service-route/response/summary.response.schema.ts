import { createSuccessResponseSchema } from 'src/factories';
import { serviceRouteSchema } from '../entity';
import { zInfer } from '../../../libs/z';

export const serviceRouteSummarySchema = serviceRouteSchema.pick({
  id: true,
  serviceId: true,
  path: true,
  routeRuleType: true,
  methods: true,
  rewrite: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const serviceRouteSummaryResponseSchema =
  createSuccessResponseSchema(serviceRouteSummarySchema);

export type ServiceRouteSummary = zInfer<typeof serviceRouteSummarySchema>;
export type ServiceRouteSummaryResponse = zInfer<typeof serviceRouteSummaryResponseSchema>;
