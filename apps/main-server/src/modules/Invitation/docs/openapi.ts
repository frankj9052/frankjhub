import {
  acceptInvitationRequestSchema,
  acceptInvitationResponseExample,
  acceptInvitationResponseSchema,
  buildErrorResponses,
  idParamsSchema,
  invitationListRequestSchema,
  invitationListResponseExample,
  invitationListResponseSchema,
  issueInvitationRequestSchema,
  issueInvitationResponseExample,
  issueInvitationResponseSchema,
  OrderEnum,
  invitationSingleResponseSchema,
  invitationDataExample,
} from '@frankjhub/shared-schema';
import { registry } from '../../../config/openapiRegistry';

// issue
registry.registerPath({
  method: 'post',
  path: '/invitation/issue',
  tags: ['Invitation'],
  summary: 'Issue an invitation to join an organization with a target role',
  description:
    'Issues a short-lived, single-use invitation token. Only the plain token is returned here for composing the email magic link.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: issueInvitationRequestSchema.openapi({
            example: {
              organizationId: 'org-uuid-001',
              targetRoleId: 'role-uuid-admin',
              email: 'admin@ny-eye.ca',
              ttlHours: 72,
              inviterUserId: 'admin-user-id',
              meta: { note: 'Initial admin onboarding' },
            },
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Invitation issued successfully',
      content: {
        'application/json': {
          schema: issueInvitationResponseSchema.openapi({
            example: issueInvitationResponseExample,
          }),
        },
      },
    },
    ...buildErrorResponses({
      400: 'ValidationError',
      401: 'UnauthorizedError',
      403: 'ForbiddenError',
    }),
  },
});

// accept
registry.registerPath({
  method: 'post',
  path: '/invitation/accept',
  tags: ['Invitation'],
  summary: 'Accept an invitation using a token (must be signed in)',
  description:
    'Accepts an invitation by verifying the provided token and matching the invited email with the signed-in user email. Grants the target role upon success.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: acceptInvitationRequestSchema.openapi({
            example: {
              currentUserId: 'user-uuid',
              currentUserEmail: 'user-email@email.com',
              token: 'eDM4dVhBNU1mY0RkN0FIVnhvWm9sa2ZpQ2tSUkE',
            },
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Invitation accepted',
      content: {
        'application/json': {
          schema: acceptInvitationResponseSchema.openapi({
            example: acceptInvitationResponseExample,
          }),
        },
      },
    },
    ...buildErrorResponses({
      400: 'BadRequestError',
      401: 'UnauthorizedError',
      403: 'ForbiddenError',
      404: 'NotFoundError',
    }),
  },
});

// list (GET)
registry.registerPath({
  method: 'get',
  path: '/invitation/list',
  tags: ['Invitation'],
  summary: 'Get invitations (paginated)',
  description: 'Returns a paginated list of invitations with filters and search.',
  security: [{ bearerAuth: [] }],
  request: {
    query: invitationListRequestSchema.openapi({
      example: {
        limit: 10,
        offset: 0,
        order: OrderEnum.ASC,
        orderBy: 'createdAt',
        search: 'admin@ny-eye.ca',
        filters: ['pending'],
      },
    }),
  },
  responses: {
    200: {
      description: 'List returned',
      content: {
        'application/json': {
          schema: invitationListResponseSchema.openapi({
            example: invitationListResponseExample,
          }),
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
      403: 'ForbiddenError',
    }),
  },
});

// list/search (POST)
registry.registerPath({
  method: 'post',
  path: '/invitation/list/search',
  tags: ['Invitation'],
  summary: 'Search invitations (paginated)',
  description: 'POST variant of listing invitations with the same schema.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: invitationListRequestSchema.openapi({
            example: {
              limit: 10,
              offset: 0,
              order: OrderEnum.ASC,
              orderBy: 'createdAt',
              search: 'admin@ny-eye.ca',
              filters: ['pending'],
            },
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'List returned',
      content: {
        'application/json': {
          schema: invitationListResponseSchema.openapi({
            example: invitationListResponseExample,
          }),
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
      403: 'ForbiddenError',
    }),
  },
});

// revoke
registry.registerPath({
  method: 'patch',
  path: '/invitation/revoke',
  tags: ['Invitation'],
  summary: 'Revoke a pending invitation',
  description: 'Revokes a PENDING invitation. No effect for non-pending ones.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: idParamsSchema.openapi({
            example: { id: 'inv-uuid-123' },
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Invitation revoked (or already non-pending)',
      content: {
        'application/json': {
          schema: invitationSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Invitation has been revoked!',
              data: invitationDataExample,
            },
          }),
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
      403: 'ForbiddenError',
      404: 'NotFoundError',
    }),
  },
});

// hard-delete
registry.registerPath({
  method: 'delete',
  path: '/invitation/hard-delete',
  tags: ['Invitation'],
  summary: 'Hard delete an invitation (physical delete)',
  description:
    'Physically deletes an invitation (including soft-deleted ones). Use with caution and audit.',
  security: [{ bearerAuth: [] }],
  request: {
    query: idParamsSchema.openapi({
      example: { id: 'inv-uuid-123' },
    }),
  },
  responses: {
    200: {
      description: 'Invitation deleted permanently',
      content: {
        'application/json': {
          schema: invitationSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Invitation permanetly deleted',
              data: invitationDataExample,
            },
          }),
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
      403: 'ForbiddenError',
      404: 'NotFoundError',
    }),
  },
});
