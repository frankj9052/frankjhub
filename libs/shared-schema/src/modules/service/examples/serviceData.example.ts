import { ServiceDto } from '../entities';

export const serviceDataExample: ServiceDto = {
  id: 'svc_123456789',
  serviceId: 'booking-service',
  name: 'Booking Service',
  baseUrl: 'https://api.example.com/booking',
  audPrefix: 'booking',
  requiredScopes: ['booking.read', 'booking.write'],
  routes: [
    {
      path: '/bookings',
      methods: ['GET', 'POST'],
      requiredScopes: ['booking.read', 'booking.write'],
      rateLimit: {
        windowMs: 60000,
        max: 100,
      },
    },
    {
      path: '/bookings/:id',
      methods: ['GET', 'PATCH', 'DELETE'],
      requiredScopes: ['booking.read', 'booking.write'],
      rewrite: '/bookings/{id}',
    },
  ],
  isActive: true,
  secretVersion: 3,
  createdAt: '2025-10-06T12:00:00Z',
  createdBy: 'admin_user',
  updatedAt: '2025-10-06T15:00:00Z',
  updatedBy: 'system_user',
  deletedAt: null,
  deletedBy: null,
  description: 'Handles booking management for the platform.',
  healthCheckPath: '/health',
  ownerTeam: 'backend-platform',
  lastRotatedAt: new Date('2025-09-30T00:00:00Z'),
};
