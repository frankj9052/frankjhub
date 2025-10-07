import { ServiceDto } from '../entities';
import { ServiceSingleResponse } from '../response';

export const serviceSingleExample: ServiceDto = {
  createdAt: new Date().toISOString(),
  id: 'svc_001',
  serviceId: 'user-service',
  name: 'User Service',
  baseUrl: 'https://api.example.com/users',
  audPrefix: 'user',
  requiredScopes: ['user:read', 'user:write'],
  routes: [
    {
      path: '/users',
      methods: ['GET', 'POST'],
      requiredScopes: ['user:read', 'user:write'],
      rateLimit: {
        windowMs: 60000, // 1 minute
        max: 100, // 100 requests per minute
      },
    },
    {
      path: '/users/:id',
      methods: ['GET', 'PUT', 'DELETE'],
      requiredScopes: ['user:read', 'user:write'],
      rewrite: '/v1/users/:id',
    },
  ],
  isActive: true,
  secretVersion: 1,
  createdBy: 'admin',
  updatedAt: new Date().toISOString(),
  updatedBy: 'admin',
  deletedAt: null,
  deletedBy: null,
  description: 'Handles all user-related operations like creation, update, and deletion.',
  healthCheckPath: '/health',
  ownerTeam: 'identity-platform',
  lastRotatedAt: new Date(),
};

export const serviceSingleResponseExample: ServiceSingleResponse = {
  status: 'success',
  message: 'Get service:"booking" successful',
  data: serviceSingleExample,
};
