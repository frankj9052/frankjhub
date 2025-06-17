import { SYSTEM_ORGANIZATION_TYPES } from './system-organizationTypes';

export const SYSTEM_ORGANIZATIONS = {
  PUBLIC: {
    name: 'public',
    description: 'Shared organization for unscoped data',
    typeName: SYSTEM_ORGANIZATION_TYPES.PUBLIC.name,
  },
  PLATFORM: {
    name: 'platform',
    description: 'Platform organization with global system authority',
    typeName: SYSTEM_ORGANIZATION_TYPES.PLATFORM.name,
  },
} as const;

export type SystemOrganizationName =
  (typeof SYSTEM_ORGANIZATIONS)[keyof typeof SYSTEM_ORGANIZATIONS]['name'];
