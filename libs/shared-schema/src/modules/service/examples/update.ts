import { ServiceUpdateRequest } from '../request';

export const serviceUpdateRequestData: ServiceUpdateRequest = {
  name: 'Authentication Service',
  description: 'Updated description: Handles user login and token management.',
  baseUrl: 'https://auth.example.com/v2',
  audPrefix: 'auth',
  baselineRequiredScopes: ['read:user', 'write:token'],
  grantedScopes: ['read:user', 'write:token', 'delete:session'],
  healthCheckPath: '/health',
  ownerTeam: 'Platform Security',
  isActive: true,
  serviceSecret: 'newSuperSecretKey123!',
};
