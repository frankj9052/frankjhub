import { CreateServiceRequest } from '@frankjhub/shared-schema';
import { buildPermissionName } from '../../codecs/permissionCodec';
import { SYSTEM_RESOURCES } from './system-resources';
import { SYSTEM_ACTIONS } from './system-actions';

export const SYSTEM_SERVICES: Record<string, CreateServiceRequest> = {
  BOOKING: {
    serviceId: 'booking',
    name: 'Booking Service',
    baseUrl: 'http://booking:4001',
    routes: [
      {
        path: '/booking',
        methods: ['GET'],
        requiredScopes: [
          buildPermissionName(SYSTEM_RESOURCES.BOOKING.name, [SYSTEM_ACTIONS.READ.name]),
        ],
      },
      {
        path: '/appointments',
        methods: ['POST'],
        requiredScopes: [
          buildPermissionName(SYSTEM_RESOURCES.BOOKING.name, [SYSTEM_ACTIONS.CREATE.name]),
        ],
      },
    ],
    requiredScopes: [],
    serviceSecret: 'booking-service-secret',
    description: 'Booking Service',
  },
};

export type SystemServiceId = (typeof SYSTEM_SERVICES)[keyof typeof SYSTEM_SERVICES]['serviceId'];
