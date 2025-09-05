import {
  buildErrorResponses,
  userOrganizationRoleCreateRequestSchema,
  userOrganizationRoleDataExample,
  userOrganizationRoleSingleResponseSchema,
  userOrganizationRoleUpdateRequestSchema,
} from '@frankjhub/shared-schema';
import { registry } from '../../../config/openapiRegistry';

// create
registry.registerPath({
  method: 'post',
  path: '/user-organization-role/create',
  tags: ['userOrganizationRole'],
  summary: 'Create a new organization role',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: userOrganizationRoleCreateRequestSchema.openapi({
            example: {
              userId: 'user-uuid',
              organizationId: 'organization-uuid',
              roleId: 'role-uuid',
            },
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Role assigned successfully!',
      content: {
        'application/json': {
          schema: userOrganizationRoleSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Role assigned successfully!',
              data: userOrganizationRoleDataExample,
            },
          }),
        },
      },
    },
    ...buildErrorResponses({
      400: 'ValidationError',
      401: 'UnauthorizedError',
    }),
  },
});

// get by userId
registry.registerPath({
  method: 'get',
  path: '/user-organization-role/{id}',
  tags: ['userOrganizationRole'],
  summary: 'Get organization roles by userId',
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string', format: 'uuid' },
      description: 'User ID',
    },
  ],
  responses: {
    200: {
      description: 'Role found',
      content: {
        'application/json': {
          schema: userOrganizationRoleSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Get organization roles successfully',
              data: userOrganizationRoleDataExample,
            },
          }),
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
      404: 'NotFoundError',
    }),
  },
});

// update
registry.registerPath({
  method: 'patch',
  path: '/user-organization-role/update',
  tags: ['userOrganizationRole'],
  summary: 'Update Organization Roles',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: userOrganizationRoleUpdateRequestSchema.openapi({
            example: {
              id: 'usr_123456789',
              organizations: [
                {
                  id: 'org_001',
                  roles: [{ id: 'role_001' }, { id: 'role_002' }],
                },
                {
                  id: 'org_002',
                  roles: [{ id: 'role_003' }],
                },
              ],
            },
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Role updated successfully',
      content: {
        'application/json': {
          schema: userOrganizationRoleSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Role updated successfully',
              data: userOrganizationRoleDataExample,
            },
          }),
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
      404: 'NotFoundError',
    }),
  },
});
