import { RoleSource } from '@frankjhub/shared-schema';
import { SYSTEM_ORGANIZATION_TYPES } from './system-organizationTypes';
import { SYSTEM_ORGANIZATIONS } from './system-organizations';

export const SYSTEM_ROLES = {
  ADMIN: {
    name: 'admin',
    description: 'Administrator with full access',
    roleSource: RoleSource.TYPE,
    orgNameOrType: SYSTEM_ORGANIZATION_TYPES.PLATFORM.name,
  },
  CLIENT: {
    name: 'client',
    description: 'Client with limited access',
    roleSource: RoleSource.TYPE,
    orgNameOrType: SYSTEM_ORGANIZATION_TYPES.PUBLIC.name,
  },
  PLATFORM_CUSTOMIZED_ROLE: {
    name: 'platformCustomizedRole',
    description: 'Test role',
    roleSource: RoleSource.ORG,
    orgNameOrType: SYSTEM_ORGANIZATIONS.PLATFORM.name,
  },
} as const;

export type SystemRoleName = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES]['name'];
