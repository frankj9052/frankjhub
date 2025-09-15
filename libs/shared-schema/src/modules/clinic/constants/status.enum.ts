export const CLINIC_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
  SUSPENDED: 'suspended',
} as const;

export type ClinicStatus = (typeof CLINIC_STATUS)[keyof typeof CLINIC_STATUS];
