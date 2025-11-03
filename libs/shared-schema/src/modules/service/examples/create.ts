import { ServiceCreateRequest } from '../request';

export const serviceCreateRequestData: ServiceCreateRequest = {
  serviceId: 'user-auth-service',
  name: 'User Authentication Service',
  baseUrl: 'https://auth.mycompany.com',
  serviceSecret: 's3cr3t-t0k3n-12345',
  description: 'Handles user authentication, token issuance, and validation.',
  audPrefix: 'auth',
  baselineRequiredScopes: ['auth:read', 'auth:write'],
  grantedScopes: ['user:read', 'user:update'],
  healthCheckPath: '/health',
  ownerTeam: 'Identity Platform',
  isActive: true,
};
