import { OrganizationDto, OrganizationRef } from '../entity';
import { OrganizationListResponse } from '../response/list.response.schema';

export const organizationDataExample: OrganizationDto = {
  id: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  name: 'North York Chinese Medicine Clinic',
  description: 'A clinic specializing in traditional Chinese medicine and acupuncture services.',
  orgTypeId: '9f3c6c4e-92b8-4a4c-9202-6a42a9bcd3e7', // 应为 orgType 表的 UUID
  orgTypeName: 'platform',
  isActive: true,
  createdAt: '2025-06-30T10:00:00Z',
  createdBy: 'd2f4e9a1-1c23-4bfa-bf0c-7b5ee1234567',
  updatedAt: '2025-06-30T10:30:00Z',
  updatedBy: 'd2f4e9a1-1c23-4bfa-bf0c-7b5ee1234567',
  deletedAt: null,
  deletedBy: null,
};

export const organizationRefDataExample: OrganizationRef = {
  id: organizationDataExample.id,
  name: organizationDataExample.name,
  description: organizationDataExample.description,
  orgTypeId: organizationDataExample.orgTypeId,
  orgTypeName: organizationDataExample.orgTypeName,
};

export const organizationListResponseExample: OrganizationListResponse = {
  status: 'success',
  message: 'Get organization list',
  data: {
    data: [
      {
        id: 'org-uuid-123',
        name: 'North York Clinic',
        description: 'Serving the community with Chinese medicine',
        orgTypeId: 'org-type-uuid-123',
        orgTypeName: 'Clinic',
        isActive: true,
        createdAt: '2024-06-01T10:00:00Z',
        updatedAt: '2024-06-10T12:00:00Z',
        deletedAt: null,
        createdBy: 'admin',
        updatedBy: 'admin',
        deletedBy: null,
      },
    ],
    total: 1,
    pageCount: 1,
    currentPage: 1,
    pageSize: 10,
  },
};
