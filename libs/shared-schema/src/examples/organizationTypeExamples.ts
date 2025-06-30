import { OrganizationTypePaginatedResponse, OrganizationTypeSchema } from "../modules";

export const organizationTypeAllDataExample: OrganizationTypeSchema = {
  id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
  name: 'Primary Care Clinic',
  description: 'A healthcare facility focused on general medical services.',
  isActive: true,
  createdAt: '2025-06-27T12:00:00Z',
  createdBy: 'admin-user-id',
  updatedAt: '2025-06-27T12:00:00Z',
  updatedBy: 'admin-user-id',
  deletedAt: null,
  deletedBy: null,
}

export const organizationTypePaginatedResponseDataExample: OrganizationTypePaginatedResponse = {
        data: [
        {
          id: 'org-type-uuid-123',
          name: 'Clinic',
          description: 'A general clinic or medical center',
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
}