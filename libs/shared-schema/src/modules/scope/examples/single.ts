import { ScopeDetail, ScopeRef, ScopeSummary } from '../response';

export const scopeRefData: ScopeRef = {
  id: 'a3f1c2e4-5b6d-47f2-8c1d-123456789abc',
  key: 'service1.user:read',
};

export const scopeSummaryData: ScopeSummary = {
  id: 'a3f1c2e4-5b6d-47f2-8c1d-123456789abc',
  actionName: 'read',
  key: 'service1.user:read',
  createdAt: '2025-11-04T11:00:00Z',
  updatedAt: '2025-11-04T12:00:00Z',
  deletedAt: null,
};

export const scopeDetailData: ScopeDetail = {
  id: 'a3f1c2e4-5b6d-47f2-8c1d-123456789abc',
  resourceId: 'r1b2c3d4-5e6f-47f2-8c1d-abcdef123456',
  actionId: 'b2d3e4f5-6a7b-48c3-9d2e-abcdef123456',
  actionName: 'read',
  key: 'service1.user:read',
  createdAt: '2025-11-04T11:00:00Z',
  updatedAt: '2025-11-04T12:00:00Z',
  deletedAt: null,
  deletedBy: null,

  resource: {
    id: 'r1b2c3d4-5e6f-47f2-8c1d-abcdef123456',
    createdAt: '2025-11-01T08:00:00Z',
    updatedAt: '2025-11-03T09:00:00Z',
    deletedAt: null,
    isActive: true,
    namespace: 'service1',
    entity: 'user',
    qualifier: '*',
    fieldsMode: 'all',
    fields: ['id', 'name', 'email'],
    resource_key: 'service1.user',
  },

  action: {
    id: 'b2d3e4f5-6a7b-48c3-9d2e-abcdef123456',
    createdAt: '2025-11-01T08:30:00Z',
    updatedAt: '2025-11-03T10:00:00Z',
    deletedAt: null,
    name: 'read',
    displayName: 'Read User',
    isActive: true,
    isSystem: false,
    sortOrder: 1,
  },
};
