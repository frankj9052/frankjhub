import { ServiceDetail, serviceRef, ServiceSummary } from '../response';

export const serviceRefData: serviceRef = {
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
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  serviceId: 'auth-service',
  name: 'Authentication Service',
  createdAt: '2025-10-01T12:15:30Z',
  description: 'Handles user authentication, token issuance, and validation.',
  baseUrl: 'https://auth.example.com',
  audPrefix: 'auth',
  baselineRequiredScopes: ['read:user', 'write:token'],
  grantedScopes: ['read:user', 'write:token', 'delete:session'],
  healthCheckPath: '/health',
  ownerTeam: 'Platform Security',
  isActive: true,
  secretVersion: 'v2.3.1',
  lastRotatedAt: '2025-10-20T08:00:00Z',
  routes: [
    { path: '/login', method: 'POST' },
    { path: '/refresh', method: 'POST' },
    { path: '/validate', method: 'GET' },
  ],
  createdBy: 'admin@example.com',
  updatedAt: '2025-10-25T10:10:00Z',
  updatedBy: 'devops@example.com',
  deletedAt: null,
  deletedBy: null,
};
