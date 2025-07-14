import { UserPayload } from '../userPayload.schema';

export const userPayloadExample: UserPayload = {
  id: 'user-uuid-123',
  userName: 'frankjia',
  sessionVersion: 'v1.0.0',
  email: 'frank.jia@example.com',
  emailVerified: true,
  profileCompleted: true,
  isActive: true,
  orgRoles: [
    {
      orgId: 'org-uuid-001',
      orgName: 'North York Chinese Medicine Clinic',
      orgType: 'clinic',
      roleCode: 'ADMIN',
      roleName: 'Administrator',
      permissionStrings: [
        'user:[read,update]@email',
        'appointment:[create,delete]',
        'organization:[read]@name',
      ],
    },
    {
      orgId: 'org-uuid-002',
      orgName: 'Downtown Wellness Center',
      orgType: 'clinic',
      roleCode: 'DOCTOR',
      roleName: 'Doctor',
      permissionStrings: ['appointment:[read,update]', 'patient:[read]@medicalHistory'],
    },
  ],
};
