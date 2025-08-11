// apps/main-server/src/modules/role/docs/openapi.ts
import { registry } from '../../../config/openapiRegistry';
import {
  idParamsSchema,
  roleCreateRequestSchema,
  roleUpdateRequestSchema,
  roleListRequestSchema,
  roleSingleResponseSchema,
  roleListResponseSchema,
  roleOptionListResponseSchema,
  roleListResponseExample,
  roleDataExample,
  buildErrorResponses,
  RoleSource,
  roleOptionListResponseExample,
} from '@frankjhub/shared-schema';

/* ----------------- PATH REGISTRATIONS ----------------- */

// create
registry.registerPath({
  method: 'post',
  path: '/role',
  tags: ['Role'],
  summary: 'Create a new role',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: roleCreateRequestSchema.openapi({
            example: {
              name: 'Clinic Admin',
              description: 'Admin role within a clinic organization',
              roleSource: RoleSource.ORG,
              sourceId: 'org-uuid-123',
              permissionIds: ['perm-uuid-1', 'perm-uuid-2'],
            },
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Role created successfully',
      content: {
        'application/json': {
          schema: roleSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Role created successfully',
              data: roleDataExample,
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

// list
registry.registerPath({
  method: 'get',
  path: '/role/list',
  tags: ['Role'],
  summary: 'Get all roles (paginated)',
  description: 'Returns a paginated list of roles.',
  security: [{ bearerAuth: [] }],
  request: {
    query: roleListRequestSchema.openapi({
      example: {
        limit: 10,
        offset: 0,
        search: 'admin',
        filters: ['active', 'source_organization'],
      },
    }),
  },
  responses: {
    200: {
      description: 'List returned',
      content: {
        'application/json': {
          schema: roleListResponseSchema.openapi({
            example: roleListResponseExample,
          }),
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
    }),
  },
});

// get by id
registry.registerPath({
  method: 'get',
  path: '/role/{id}',
  tags: ['Role'],
  summary: 'Get role by ID',
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string', format: 'uuid' },
      description: 'Role ID',
    },
  ],
  responses: {
    200: {
      description: 'Role found',
      content: {
        'application/json': {
          schema: roleSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Get role successful',
              data: roleDataExample,
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
  path: '/role/update',
  tags: ['Role'],
  summary: 'Update role',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: roleUpdateRequestSchema.openapi({
            example: {
              id: 'role-uuid-abc',
              name: 'Clinic Admin (Updated)',
              description: 'Updated description',
              isActive: true,
              roleSource: RoleSource.TYPE,
              sourceId: 'org-type-uuid-456',
              permissionIds: ['perm-uuid-3', 'perm-uuid-4'],
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
          schema: roleSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Role updated successfully',
              data: roleDataExample,
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

// soft-delete
registry.registerPath({
  method: 'patch',
  path: '/role/soft-delete',
  tags: ['Role'],
  summary: 'Soft delete role',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: idParamsSchema.openapi({
            example: { id: 'role-uuid-123' },
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Soft deleted successfully',
      content: {
        'application/json': {
          schema: roleSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Role soft-deleted',
              data: roleDataExample,
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

// restore
registry.registerPath({
  method: 'patch',
  path: '/role/restore',
  tags: ['Role'],
  summary: 'Restore soft-deleted role',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: idParamsSchema.openapi({
            example: { id: 'role-uuid-123' },
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Restored successfully',
      content: {
        'application/json': {
          schema: roleSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Role restored',
              data: roleDataExample,
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

// hard-delete
registry.registerPath({
  method: 'delete',
  path: '/role/hard-delete',
  tags: ['Role'],
  summary: 'Hard delete role',
  security: [{ bearerAuth: [] }],
  request: {
    query: idParamsSchema.openapi({
      example: { id: 'role-uuid-123' },
    }),
  },
  responses: {
    200: {
      description: 'Deleted permanently',
      content: {
        'application/json': {
          schema: roleSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Role permanently deleted',
              data: roleDataExample,
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

// option-list
registry.registerPath({
  method: 'get',
  path: '/role/options',
  tags: ['Role'],
  summary: 'Get all role options (id, name, code)',
  description: 'Returns a simplified list of roles for dropdown selection.',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'List of role options',
      content: {
        'application/json': {
          schema: roleOptionListResponseSchema.openapi({
            example: roleOptionListResponseExample,
          }),
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
    }),
  },
});
