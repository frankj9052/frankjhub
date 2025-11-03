import { ServiceRouteDetail, ServiceRouteRef, ServiceRouteSummary } from '../response';

export const serviceRouteRefData: ServiceRouteRef = {
  path: '/api/users/123',
  id: '550e8400-e29b-41d4-a716-446655440000',
};

export const serviceRouteSummaryData: ServiceRouteSummary = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  serviceId: 'svc-12345',
  path: '/api/users',
  routeRuleType: 'prefix',
  methods: ['GET', 'POST', 'PUT'],
  isActive: true,
  createdAt: '2025-11-03T16:00:00.000Z',
  updatedAt: '2025-11-03T16:30:00.000Z',
  deletedAt: null,
  rewrite: '/api/v2/users',
};

export const serviceRouteDetailData: ServiceRouteDetail = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  serviceId: 'svc-12345',
  path: '/api/users/:id',
  routeRuleType: 'exact',
  methods: ['GET', 'PUT', 'DELETE'],
  isActive: true,
  createdAt: '2025-11-03T16:00:00.000Z',
  createdBy: 'admin',
  updatedAt: '2025-11-03T16:30:00.000Z',
  updatedBy: 'admin',
  deletedAt: null,
  deletedBy: null,
  rewrite: '/api/v2/users/:id',
  rateLimit: {
    windowMs: 60000, // 1 分钟
    max: 100, // 最大请求次数
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: 'userId',
  },
};
