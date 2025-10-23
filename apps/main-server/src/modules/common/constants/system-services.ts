import { ServiceCreateRequest } from '@frankjhub/shared-schema';
import { buildPermissionName } from '../../codecs/permissionCodec';
import { SYSTEM_RESOURCES } from './system-resources';
import { SYSTEM_ACTIONS } from './system-actions';
import { env } from '../../../config/env';

export const SYSTEM_SERVICES: Record<string, ServiceCreateRequest> = {
  BOOKING: {
    serviceId: 'booking',
    name: 'Booking Service',
    baseUrl: 'http://localhost:4000',
    audPrefix: 'api://',
    routes: [
      {
        type: 'exact',
        path: '/booking',
        methods: ['GET'],
        requiredScopes: [
          buildPermissionName(SYSTEM_RESOURCES.BOOKING.name, [SYSTEM_ACTIONS.READ.name]),
        ],
        rewrite: '^/booking', // 把前缀 /booking 去掉
      },
      {
        type: 'exact',
        path: '/health',
        methods: ['GET'],
        requiredScopes: [],
        rewrite: '^/booking',
      },
    ],
    // 服务级通用要求
    requiredScopes: [],
    serviceSecret: 'booking-server-secret',
    description: 'Booking Service',
  },
  MAIN: {
    serviceId: 'main',
    name: 'Main Service',
    baseUrl: env.APP_BASE_URL,
    audPrefix: 'api://',
    requiredScopes: [],
    serviceSecret: 'main-server-secret',
    description: 'Main Service',
    routes: [
      /** Auth */
      {
        type: 'prefix',
        pathPrefix: '/api/auth',
        methods: ['POST', 'GET'],
        requiredScopes: [],
        rewrite: '^/main',
      },
    ],
  },
  API_GATEWAY: {
    serviceId: 'api-gateway',
    name: 'API Gateway',
    baseUrl: 'api-gateway-secret.dev',
    audPrefix: 'api://',
    requiredScopes: [],
    serviceSecret: env.GATEWAY_SERVICE_SECRET || 'api-gateway-secret',
    description: 'API Gateway Service',
    routes: [],
  },
};

export type SystemServiceId = (typeof SYSTEM_SERVICES)[keyof typeof SYSTEM_SERVICES]['serviceId'];
