import { ResourceDto, ResourceRef } from '../entity';
import { ResourceListPageData, ResourceListResponse } from '../response';

export const resourceDataExample: ResourceDto = {
  id: '4b2a8e9f-8d90-4562-9e71-8c7287a6b0c3',
  name: 'EditClinicProfile',
  description: 'Grants permission to edit the clinic profile information.',
  isActive: true,
  createdAt: '2025-07-29T14:20:00.000Z',
  createdBy: 'Frank',
  updatedAt: '2025-07-30T09:10:00.000Z',
  updatedBy: 'Frank',
  deletedAt: null,
  deletedBy: null,
};

export const resourceRefDataExample: ResourceRef = {
  id: resourceDataExample.id,
  name: resourceDataExample.name,
  description: resourceDataExample.description,
};

export const resourceListPageDataExample: ResourceListPageData = {
  data: [
    {
      id: 'e1f7d590-9f3a-4c1a-8424-bdc2781a7a21',
      name: 'ManageUsers',
      description: 'Allows management of user accounts.',
      isActive: true,
      createdAt: '2025-07-25T09:00:00.000Z',
      createdBy: 'Frank',
      updatedAt: '2025-07-29T12:00:00.000Z',
      updatedBy: 'Frank',
      deletedAt: null,
      deletedBy: null,
    },
    {
      id: 'b9ce4ac4-bd68-47d5-b607-0f0e239ee4cf',
      name: 'ViewReports',
      description: 'Allows access to view system reports.',
      isActive: false,
      createdAt: '2025-06-15T11:30:00.000Z',
      createdBy: 'admin',
      updatedAt: '2025-07-01T10:10:00.000Z',
      updatedBy: 'admin',
      deletedAt: '2025-07-15T08:45:00.000Z',
      deletedBy: 'admin',
    },
  ],
  total: 2,
  pageCount: 1,
  currentPage: 1,
  pageSize: 10,
  search: 'report',
  filters: ['inactive', 'deleted'],
};

export const resourceListResponseExample: ResourceListResponse = {
  status: 'success',
  message: 'Get resource list successful',
  data: resourceListPageDataExample,
};
