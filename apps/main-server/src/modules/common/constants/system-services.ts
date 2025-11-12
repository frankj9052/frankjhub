import { ServiceCreateRequest } from '@frankjhub/shared-schema';
import { env } from '../../../config/env';

export const SYSTEM_SERVICES: Record<string, ServiceCreateRequest> = {
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
};

export type SystemServiceId = (typeof SYSTEM_SERVICES)[keyof typeof SYSTEM_SERVICES]['serviceId'];
