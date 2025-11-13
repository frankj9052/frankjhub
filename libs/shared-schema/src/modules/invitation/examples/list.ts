import { RoleSource } from '../../../enums/roleSource.enum';
import { InvitationListRequest } from '../request/list.request.schema';
import { InvitationListResponse } from '../response/list.response.schema';
import { OrderEnum } from '../../../enums/order.enum';

export const invitationListRequestData: InvitationListRequest = {
  limit: 20,
  offset: 0,
  order: OrderEnum.DESC, // assuming OrderEnum = "ASC" | "DESC"
  orderBy: 'createdAt',
  search: 'example.com',
  filters: {
    any: [
      {
        key: 'status',
        values: ['accepted', 'revoked'],
      },
    ],
    all: [],
  },
};

export const invitationListResponseData: InvitationListResponse = {
  status: 'success',
  data: {
    data: [
      {
        createdAt: '2025-11-10T16:00:00Z',
        status: 'pending',
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // UUID
        organizationId: 'org-123',
        organizationName: 'Acme Corporation',
        orgTypeId: 'type-001',
        orgTypeName: 'Company',
        targetRoleId: 'role-789',
        targetRoleCode: 'ADMIN',
        targetRoleName: 'Administrator',
        targetRoleSource: RoleSource.TYPE,
        email: 'invitee@example.com',
        inviterUserId: 'user-456',
        inviterUserName: 'John Doe',
        acceptedUserId: null,
        acceptedUserName: null,
        expiresAt: '2025-12-10T16:00:00Z',
        tokenHash: 'hashed-token-placeholder',
        acceptUrlBase: 'https://app.example.com/accept-invite',
        createdBy: 'user-456',
        updatedAt: '2025-11-10T16:05:00Z',
        updatedBy: 'user-456',
        deletedAt: null,
        deletedBy: null,
        meta: {
          notes: 'First invitation',
        },
      },
    ],
    total: 3,
    pageCount: 1,
    currentPage: 1,
    pageSize: 10,
    search: undefined,
    filters: ['status'],
  },
  message: 'Get invitation list successful',
};
