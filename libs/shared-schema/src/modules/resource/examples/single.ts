import { ResourceDetail, ResourceRef, ResourceSummary } from '../response';

export const resourceRefData: ResourceRef = {
  id: 'c9d4c053-49b6-410c-bc78-2d54a9991870',
  resource_key: 'main.user.:id',
};

export const resourceSummaryData: ResourceSummary = {
  id: 'c9d4c053-49b6-410c-bc78-2d54a9991870',
  namespace: 'main',
  entity: 'user',
  qualifier: ':id',
  fieldsMode: 'whitelist',
  fields: ['id', 'name', 'email'],
  isActive: true,
  resource_key: 'main.user.:id',
  createdAt: '2025-10-30T10:00:00.000Z',
  deletedAt: null,
};

export const resourceDetailData: ResourceDetail = {
  id: 'c9d4c053-49b6-410c-bc78-2d54a9991870',
  namespace: 'main',
  entity: 'user',
  qualifier: ':id',
  fieldsMode: 'whitelist',
  fields: ['id', 'name', 'email', 'role'],
  isActive: true,
  metadata: {
    description: 'User resource for authentication and profile management',
    owner: 'adminUser',
    tags: ['auth', 'core'],
    lastAudit: '2025-10-25T14:20:00.000Z',
  },
  resource_key: 'main.user.:id',
  version: 3,
  createdAt: '2025-10-01T09:00:00.000Z',
  createdBy: 'system',
  updatedAt: '2025-10-28T12:30:00.000Z',
  updatedBy: 'adminUser',
  deletedAt: null,
  deletedBy: null,
};
