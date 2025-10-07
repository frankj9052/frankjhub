import { ServiceCreateRequest } from '../request';

export const serviceCreateRequestExample: ServiceCreateRequest = {
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
  serviceSecret: 'supersecretkey123',
  description: 'Handles all user-related operations such as creation, update, and deletion.',
  healthCheckPath: '/health',
  ownerTeam: 'identity-platform',
};
