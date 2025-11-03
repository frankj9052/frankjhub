import { ServiceDetail, ServiceRef, ServiceSummary } from '../response';

export const serviceRefData: ServiceRef = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  serviceId: 'auth-service',
  name: 'Authentication Service',
};

export const serviceSummaryData: ServiceSummary = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  serviceId: 'auth-service',
  name: 'Authentication Service',
  createdAt: '2025-10-01T12:15:30Z',
  baseUrl: 'https://auth.example.com',
  ownerTeam: 'Platform Security',
  isActive: true,
  lastRotatedAt: '2025-10-20T08:00:00Z',
  updatedAt: '2025-10-25T10:10:00Z',
  deletedAt: null,
};

export const serviceDetailData: ServiceDetail = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  serviceId: 'svc-12345',
  name: 'User Service',
  description: 'Handles all user-related operations',
  isActive: true,
  baseUrl: 'https://api.example.com/users',
  audPrefix: 'user-service',
  baselineRequiredScopes: ['read:users', 'write:users'],
  grantedScopes: ['read:users', 'write:users', 'delete:users'],
  healthCheckPath: '/health',
  ownerTeam: 'platform-team',
  secretVersion: 'v1.0.0',
  lastRotatedAt: '2025-10-15T12:00:00.000Z',
  createdAt: '2025-10-01T08:00:00.000Z',
  createdBy: 'admin',
  updatedAt: '2025-10-20T09:30:00.000Z',
  updatedBy: 'admin',
  deletedAt: null,
  deletedBy: null,
  routes: [
    {
      id: 'route-001',
      serviceId: 'svc-12345',
      path: '/api/users',
      routeRuleType: 'prefix',
      methods: ['GET', 'POST'],
      isActive: true,
      createdAt: '2025-10-01T08:05:00.000Z',
      updatedAt: '2025-10-15T10:00:00.000Z',
      deletedAt: null,
      rewrite: null,
    },
    {
      id: 'route-002',
      serviceId: 'svc-12345',
      path: '/api/users/:id',
      routeRuleType: 'exact',
      methods: ['GET', 'PUT', 'DELETE'],
      isActive: true,
      createdAt: '2025-10-02T08:05:00.000Z',
      updatedAt: null,
      deletedAt: null,
      rewrite: '/api/v2/users/:id',
    },
  ],
};
