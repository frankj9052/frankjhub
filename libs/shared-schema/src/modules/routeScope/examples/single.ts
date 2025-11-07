import { RouteScopeDetail, RouteScopeRef, RouteScopeSummary } from '../response';

export const routeScopeRefData: RouteScopeRef = {
  id: '6a7e5c12-4b2f-4c2d-9d8e-35a6f2f5a2b1',
  scopeKey: 'auth.user:read', // ✅ 合规 scope key：namespace.entity:action
};

export const routeScopeSummaryData: RouteScopeSummary = {
  id: '8c4f7a91-2b6a-4c8f-9b7e-12345a6b9cde',
  routeId: 'b0e24f8f-3d8e-4d7d-96c2-7d3b7e69a05a',
  scopeId: '4cfc59ac-86d7-4e6b-8b24-62b8bcaab791',
  scopeKey: 'auth.user:read', // ✅ namespace.entity:action
  createdAt: '2025-10-22T15:23:45.000Z',
  updatedAt: '2025-11-01T10:12:11.000Z',
  deletedAt: null,
};

export const routeScopeDetailData: RouteScopeDetail = {
  id: 'f1a2b3c4-d5e6-7f89-a0b1-c2d3e4f5a6b7',
  routeId: 'r1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  scopeId: 's1a2b3c4-d5e6-7f89-a0b1-c2d3e4f5a6b7',
  scopeKey: 'auth.user:read', // namespace.entity:action
  createdAt: '2025-10-22T15:23:45.000Z',
  updatedAt: '2025-11-01T10:12:11.000Z',
  deletedAt: null,
  createdBy: 'admin@system',
  updatedBy: 'devops@system',
  deletedBy: null,

  route: {
    id: 'r1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    serviceId: 'auth-service',
    path: '/api/users/:id',
    routeRuleType: 'prefix',
    methods: ['GET'], // 对应 read
    isActive: true,
    createdAt: '2025-10-20T10:00:00.000Z',
    updatedAt: '2025-10-30T09:00:00.000Z',
    deletedAt: null,
    rewrite: '/v1/users/:id',
  },

  scope: {
    id: 's1a2b3c4-d5e6-7f89-a0b1-c2d3e4f5a6b7',
    key: 'auth.user:read', // 同 scopeKey
    actionName: 'read',
    createdAt: '2025-10-15T08:00:00.000Z',
    updatedAt: '2025-10-25T12:30:00.000Z',
    deletedAt: null,
  },
};
