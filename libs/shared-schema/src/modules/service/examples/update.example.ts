import { SimpleResponse } from '../../../modules/common';
import { ServiceUpdateRequest } from '../request';

export const serviceUpdateRequestExample: ServiceUpdateRequest = {
  id: 'svc_123456',
  description: 'Updated description for user service.',
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
      methods: ['GET', 'PUT'],
      requiredScopes: ['user:read', 'user:write'],
      rewrite: '/v1/users/:id',
    },
  ],
  healthCheckPath: '/health',
  ownerTeam: 'identity-platform',
  serviceSecret: 'updatedSecretKey123',
};

export const serviceUpdateResponseExample: SimpleResponse = {
  status: 'success',
  message: 'Service: booking updated by admin',
};
