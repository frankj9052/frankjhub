import { CreateServiceRequest } from '@frankjhub/shared-schema';
import { buildPermissionName } from '../../codecs/permissionCodec';
import { SYSTEM_RESOURCES } from './system-resources';
import { SYSTEM_ACTIONS } from './system-actions';

export const SYSTEM_SERVICES: Record<string, CreateServiceRequest> = {
  BOOKING: {
    serviceId: 'booking',
    name: 'Booking Service',
    baseUrl: 'http://localhost:4000',
    audPrefix: 'api://',
    routes: [
      {
        path: '/booking',
        methods: ['GET'],
        requiredScopes: [
          buildPermissionName(SYSTEM_RESOURCES.BOOKING.name, [SYSTEM_ACTIONS.READ.name]),
        ],
        rewrite: '^/booking', // 把前缀 /booking 去掉
      },
      {
        path: '/booking',
        methods: ['POST'],
        requiredScopes: [
          buildPermissionName(SYSTEM_RESOURCES.BOOKING.name, [SYSTEM_ACTIONS.CREATE.name]),
        ],
        rewrite: '^/booking',
      },
    ],
    // 服务级通用要求
    requiredScopes: [],
    serviceSecret: 'booking-service-secret',
    description: 'Booking Service',
  },
};

export type SystemServiceId = (typeof SYSTEM_SERVICES)[keyof typeof SYSTEM_SERVICES]['serviceId'];
