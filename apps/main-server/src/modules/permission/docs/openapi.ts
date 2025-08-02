import { registry } from '../../../config/openapiRegistry';
import {
  idParamsSchema,
  permissionCreateRequestSchema,
  permissionUpdateRequestSchema,
  permissionListRequestSchema,
  permissionSingleResponseSchema,
  permissionListResponseSchema,
  permissionOptionListResponseSchema,
  permissionListResponseExample,
  permissionDataExample,
  buildErrorResponses,
} from '@frankjhub/shared-schema';

// ----------------- PATH REGISTRATIONS -----------------

// create
registry.registerPath({
  method: 'post',
  path: '/permission',
  tags: ['Permission'],
  summary: 'Create a new permission',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: permissionCreateRequestSchema.openapi({
            example: {
              resourceId: 'resource-uuid-123',
              actionIds: ['action-uuid-1', 'action-uuid-2'],
              fields: ['name', 'email'],
              condition: { orgId: 'org-123' },
              description: 'Read name/email for own org',
            },
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Permission created successfully',
      content: {
        'application/json': {
          schema: permissionSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Permission create successful',
              data: permissionDataExample,
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
  path: '/permission/list',
  tags: ['Permission'],
  summary: 'Get all permissions (paginated)',
  description: 'Returns a paginated list of permissions.',
  security: [{ bearerAuth: [] }],
  request: {
    query: permissionListRequestSchema.openapi({
      example: {
        limit: 10,
        offset: 0,
        search: 'read',
        filters: ['active'],
      },
    }),
  },
  responses: {
    200: {
      description: 'List returned',
      content: {
        'application/json': {
          schema: permissionListResponseSchema.openapi({
            example: permissionListResponseExample,
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
  path: '/permission/{id}',
  tags: ['Permission'],
  summary: 'Get permission by ID',
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
        format: 'uuid',
      },
      description: 'Permission ID',
    },
  ],
  responses: {
    200: {
      description: 'Permission found',
      content: {
        'application/json': {
          schema: permissionSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Permission get successful',
              data: permissionDataExample,
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
  path: '/permission/update',
  tags: ['Permission'],
  summary: 'Update permission',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: permissionUpdateRequestSchema.openapi({
            example: {
              id: 'permission-uuid-abc',
              resourceId: 'resource-uuid-123',
              actionIds: ['action-uuid-1', 'action-uuid-2'],
              fields: ['name', 'email'],
              condition: { orgId: 'org-456' },
              description: 'Updated description',
              isActive: true,
            },
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Permission updated successfully',
      content: {
        'application/json': {
          schema: permissionSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Permission update successful',
              data: permissionDataExample,
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
  path: '/permission/soft-delete',
  tags: ['Permission'],
  summary: 'Soft delete permission',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: idParamsSchema.openapi({
            example: { id: 'permission-uuid-123' },
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
          schema: permissionSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Permission delete successful',
              data: permissionDataExample,
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
  path: '/permission/restore',
  tags: ['Permission'],
  summary: 'Restore soft-deleted permission',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: idParamsSchema.openapi({
            example: { id: 'permission-uuid-123' },
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
          schema: permissionSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Permission restore successful',
              data: permissionDataExample,
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
  path: '/permission/hard-delete',
  tags: ['Permission'],
  summary: 'Hard delete permission',
  security: [{ bearerAuth: [] }],
  request: {
    query: idParamsSchema.openapi({
      example: { id: 'permission-uuid-123' },
    }),
  },
  responses: {
    200: {
      description: 'Deleted permanently',
      content: {
        'application/json': {
          schema: permissionSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Permission permanent delete successful',
              data: permissionDataExample,
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
  path: '/permission/options',
  tags: ['Permission'],
  summary: 'Get all permission options (id and name only)',
  description: 'Returns a simplified list of permissions for dropdown selection.',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'List of permission options',
      content: {
        'application/json': {
          schema: permissionOptionListResponseSchema.openapi({
            example: {
              status: 'success',
              data: [
                { id: 'perm-uuid-001', name: 'user:[read]@name?orgId=123' },
                { id: 'perm-uuid-002', name: 'doctor:[update]@email' },
              ],
            },
          }),
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
    }),
  },
});
