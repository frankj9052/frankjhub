import { RoleSource } from '../../../enums';
import { InvitationDto } from '../entity';
import {
  AcceptInvitationResponse,
  InvitationListResponse,
  IssueInvitationResponse,
} from '../response';
import { INVITATION_STATUS } from '../constants';

export const invitationDataExample: InvitationDto = {
  id: 'inv-uuid-123',
  organizationId: 'org-uuid-001',
  organizationName: 'North York Eye Clinic',
  orgTypeId: 'orgtype-uuid-clinic',
  orgTypeName: 'Clinic',
  targetRoleId: 'role-uuid-admin',
  targetRoleCode: 'CLINIC_ADMIN',
  targetRoleName: 'Clinic Admin',
  targetRoleSource: RoleSource.TYPE,
  email: 'admin@ny-eye.ca',
  status: 'pending',
  inviterUserId: 'user-uuid-inviter',
  inviterUserName: 'Alice Manager',
  acceptedUserId: null,
  acceptedUserName: null,
  expiresAt: '2025-09-22T10:00:00.000Z',
  tokenHash: 'Secret', // 仅展示占位
  acceptUrlBase: 'https://auth.frankjhub.com',
  meta: { note: 'Initial admin onboarding' },
  createdBy: 'Alice Manager',
  createdAt: '2025-09-19T08:00:00.000Z',
  updatedBy: 'Alice Manager',
  updatedAt: '2025-09-19T08:00:00.000Z',
  deletedBy: null,
  deletedAt: null,
};

export const issueInvitationResponseExample: IssueInvitationResponse = {
  status: 'success',
  message: 'Invitation issued successfully',
  data: {
    invitationId: 'inv-uuid-123',
    // 注意：仅在此接口返回明文 token（用于拼接 Magic Link）
    token: 'eDM4dVhBNU1mY0RkN0FIVnhvWm9sa2ZpQ2tSUkE', // 示例
    expiresAt: '2025-09-22T10:00:00.000Z',
  },
};

export const acceptInvitationResponseExample: AcceptInvitationResponse = {
  status: 'success',
  message: 'New role accepted!',
  data: {
    organizationId: 'org-uuid-001',
    targetRoleId: 'role-uuid-admin',
    invitationId: 'inv-uuid-123',
  },
};

export const invitationListResponseExample: InvitationListResponse = {
  status: 'success',
  message: 'Get invitation list successful',
  data: {
    total: 3,
    pageCount: 1,
    currentPage: 1,
    pageSize: 10,
    search: undefined,
    filters: {
      status: INVITATION_STATUS.PENDING,
    },
    data: [invitationDataExample],
  },
};
