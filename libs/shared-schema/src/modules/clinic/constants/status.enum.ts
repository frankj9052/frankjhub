import { z } from '../../../libs/z';

export const CLINIC_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
  SUSPENDED: 'suspended',
} as const;

export type ClinicStatus = (typeof CLINIC_STATUS)[keyof typeof CLINIC_STATUS];
export const clinicStatusSchema = z.nativeEnum(CLINIC_STATUS);
