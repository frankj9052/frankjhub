import { SYSTEM_ROLES } from './system-role';

export const SYSTEM_SERVICES = {
  MAIN_SERVER: {
    serviceId: 'main-server',
    secret: 'abc123', // 初始明文（用于种子脚本 bcrypt hash）
    roles: [
      {
        name: SYSTEM_ROLES.ADMIN.name,
        roleSource: SYSTEM_ROLES.ADMIN.roleSource,
        orgNameOrType: SYSTEM_ROLES.ADMIN.orgNameOrType,
      },
    ],
    description: 'Core backend server for platform ops',
  },
  ADMIN_PORTAL: {
    serviceId: 'admin-portal',
    secret: 'jurong-is-handsome',
    roles: [
      {
        name: SYSTEM_ROLES.ADMIN.name,
        roleSource: SYSTEM_ROLES.ADMIN.roleSource,
        orgNameOrType: SYSTEM_ROLES.ADMIN.orgNameOrType,
      },
    ],
    description: 'admin management portal',
  },
  BILLING_SERVICE: {
    serviceId: 'billing-service',
    secret: 'xyz456',
    roles: [
      {
        name: SYSTEM_ROLES.ADMIN.name,
        roleSource: SYSTEM_ROLES.ADMIN.roleSource,
        orgNameOrType: SYSTEM_ROLES.ADMIN.orgNameOrType,
      },
    ],
    description: 'Handles billing and payment workflows',
  },
  BOOKING_SERVICE: {
    serviceId: 'booking-service',
    secret: 'booking789',
    roles: [
      {
        name: SYSTEM_ROLES.ADMIN.name,
        roleSource: SYSTEM_ROLES.ADMIN.roleSource,
        orgNameOrType: SYSTEM_ROLES.ADMIN.orgNameOrType,
      },
    ],
    description: 'Handles appointment booking logic',
  },
} as const;

export type SystemServiceId = (typeof SYSTEM_SERVICES)[keyof typeof SYSTEM_SERVICES]['serviceId'];
