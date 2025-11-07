import { createSuccessResponseSchema } from '../../../factories/createSuccessResponse.schema';
import { serviceSchema } from '../entities/service.schema';
import { zInfer } from '../../../libs/z';

export const serviceSummarySchema = serviceSchema.pick({
  id: true,
  serviceId: true,
  name: true,
  baseUrl: true,
  ownerTeam: true,
  isActive: true,
  lastRotatedAt: true,
  updatedAt: true,
  createdAt: true,
  deletedAt: true,
});

export const serviceSummaryResponseSchema = createSuccessResponseSchema(serviceSummarySchema);

export type ServiceSummary = zInfer<typeof serviceSummarySchema>;
export type ServiceSummaryReponse = zInfer<typeof serviceSummaryResponseSchema>;
