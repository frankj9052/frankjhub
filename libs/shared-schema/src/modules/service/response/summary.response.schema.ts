import { createSuccessResponseSchema } from '../../../factories';
import { serviceSchema } from '../entities';
import { zInfer } from '../../../libs';

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
