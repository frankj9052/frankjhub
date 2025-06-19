import { UserPayload } from '@frankjhub/shared-schema';

export const userPayloadExample: UserPayload = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  userName: 'john_doe',
  email: 'john@example.com',
  emailVerified: true,
  profileCompleted: true,
  isActive: true,
  sessionVersion: '4fa85f64-5717-4562-b3fc-2c963f66afa6',
  orgRoles: [
    {
      orgId: '1fa85f64-5717-4562-b3fc-2c963f66afa6',
      orgName: 'Noqclinic',
      orgType: 'clinic',
      roleCode: 'admin',
      roleName: 'Administrator',
      permissionStrings: ['user:[read,write]@name', 'appointment:[read]@*'],
    },
  ],
};
