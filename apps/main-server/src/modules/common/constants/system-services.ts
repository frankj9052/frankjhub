import { ServiceCreateRequest } from '@frankjhub/shared-schema';
import { env } from '../../../config/env';

export const SYSTEM_SERVICE_KEY_LIST = ['BOOKING', 'MAIN', 'SYSTEM'] as const;
export type SystemServiceKey = (typeof SYSTEM_SERVICE_KEY_LIST)[number];

export const SYSTEM_SERVICES = {
  // 这个 SYSTEM 服务主要是个“逻辑归属点”，不会真的用来走路由。
  SYSTEM: {
    serviceId: 'system',
    name: 'System',
    baseUrl: env.APP_BASE_URL, // 其实用不到，随便给个合法的
    audPrefix: 'api://',
    baselineRequiredScopes: [],
    grantedScopes: [],
    healthCheckPath: undefined,
    ownerTeam: 'jurong',
    isActive: true,
    serviceSecret: 'system-server-secret',
    description: 'Global / meta resources',
  },
  BOOKING: {
    serviceId: 'booking',
    name: 'Booking Service',
    baseUrl: 'http://localhost:4000',
    audPrefix: 'api://',
    // 服务级通用要求
    baselineRequiredScopes: [],
    grantedScopes: [],
    healthCheckPath: undefined,
    ownerTeam: 'jurong',
    isActive: true,
    serviceSecret: 'booking-server-secret',
    description: 'Booking Service',
  },
  MAIN: {
    serviceId: 'main',
    name: 'Main Service',
    baseUrl: env.APP_BASE_URL,
    audPrefix: 'api://',
    baselineRequiredScopes: [],
    grantedScopes: [],
    healthCheckPath: undefined,
    ownerTeam: 'jurong',
    isActive: true,
    serviceSecret: 'main-server-secret',
    description: 'Main Service',
  },
} as const satisfies Record<SystemServiceKey, ServiceCreateRequest>;
