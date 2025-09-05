import { Gender, Honorific, RoleSource } from '../../../enums';
import { UserOrganizationRoleDto } from '../entity/schema';

export const userOrganizationRoleDataExample: UserOrganizationRoleDto = {
  id: 'usr_123456789',
  userName: 'frank.jia',
  email: 'frank.jia@example.com',
  firstName: 'Frank',
  lastName: 'Jia',
  middleName: null,
  gender: Gender.MALE,
  dateOfBirth: '1990-05-20',
  honorific: Honorific.DR,
  avatarImage: 'https://example.com/avatars/frank.png',
  organizations: [
    {
      id: 'org_001',
      name: 'North York Eye Clinic',
      orgTypeId: 'orgType_01',
      orgTypeName: 'Clinic',
      description: 'A specialized eye clinic in Toronto.',
      roles: [
        {
          id: 'role_001',
          name: 'Administrator',
          code: 'ADMIN',
          description: 'Has full access to clinic operations.',
          roleSource: RoleSource.TYPE,
          userOrganizationRole: {
            id: 'uor_001',
            createdAt: '2025-09-01T10:00:00.000Z',
            updatedAt: '2025-09-05T15:30:00.000Z',
            isActive: true,
            createdBy: 'system',
            updatedBy: 'admin_user',
            deletedAt: null,
            deletedBy: null,
          },
        },
        {
          id: 'role_002',
          name: 'Doctor',
          code: 'DOCTOR',
          description: 'Can manage patient appointments and records.',
          roleSource: RoleSource.ORG,
          userOrganizationRole: {
            id: 'uor_002',
            createdAt: '2025-08-20T09:15:00.000Z',
            updatedAt: '2025-08-30T18:45:00.000Z',
            isActive: false,
            createdBy: 'admin_user',
            updatedBy: 'frank.jia',
            deletedAt: '2025-09-02T12:00:00.000Z',
            deletedBy: 'admin_user',
          },
        },
      ],
    },
  ],
};
