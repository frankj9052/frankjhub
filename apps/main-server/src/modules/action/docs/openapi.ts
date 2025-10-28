import { registry } from '../../../config/openapiRegistry';
import {
  actionCreateRequestSchema,
  actionUpdateRequestSchema,
  actionListRequestSchema,
  idParamsSchema,
  actionOptionListResponseSchema,
  actionDataExample,
  actionListResponseSchema,
  actionListResponseExample,
  buildErrorResponses,
  actionCreateRequestData,
  simpleResponseSchema,
  actionListRequestData,
  actionDetailResponse,
} from '@frankjhub/shared-schema';

// ----------------- PATH REGISTRATIONS -----------------
// create
registry.registerPath({
  method: 'post',
  path: '/action',
  tags: ['Action'],
  summary: 'Create a new action',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: actionCreateRequestSchema.openapi({
            example: actionCreateRequestData,
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Action created successfully',
      content: {
        'application/json': {
          schema: simpleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Action create successful',
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
  path: '/action/list',
  tags: ['Action'],
  summary: 'Get all actions (paginated)',
  description: 'Returns a paginated list of all actions.',
  security: [{ bearerAuth: [] }],
  request: {
    query: actionListRequestSchema.openapi({
      example: actionListRequestData,
    }),
  },
  responses: {
    200: {
      description: 'List returned',
      content: {
        'application/json': {
          schema: actionListResponseSchema.openapi({
            example: actionListResponseExample,
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
  path: '/action/{id}',
  tags: ['Action'],
  summary: 'Get action by ID',
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
      description: 'Action ID',
    },
  ],
  responses: {
    200: {
      description: 'Action found',
      content: {
        'application/json': {
          schema: actionDetailResponse.openapi({
            example: {
              status: 'success',
              message: 'Action get successful',
              data: actionDataExample,
            },
          }),
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
      404: 'UnauthorizedError',
    }),
  },
});

// update
registry.registerPath({
  method: 'patch',
  path: '/action/update',
  tags: ['Action'],
  summary: 'Update action',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: actionUpdateRequestSchema.openapi({
            example: {
              id: 'action-uuid-123',
              name: 'read',
              description: 'Updated description',
            },
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Updated successfully',
      content: {
        'application/json': {
          schema: simpleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Action update successful',
            },
          }),
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
      404: 'UnauthorizedError',
    }),
  },
});

// soft-delete
registry.registerPath({
  method: 'patch',
  path: '/action/soft-delete',
  tags: ['Action'],
  summary: 'Soft delete action',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: idParamsSchema.openapi({
            example: { id: 'action-uuid-123' },
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
          schema: simpleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Action delete successful',
            },
          }),
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
      404: 'UnauthorizedError',
    }),
  },
});

// restore
registry.registerPath({
  method: 'patch',
  path: '/action/restore',
  tags: ['Action'],
  summary: 'Restore soft-deleted action',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: idParamsSchema.openapi({
            example: { id: 'action-uuid-123' },
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
          schema: simpleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Action restore successful',
            },
          }),
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
      404: 'UnauthorizedError',
    }),
  },
});

// hard-delete
registry.registerPath({
  method: 'delete',
  path: '/action/hard-delete',
  tags: ['Action'],
  summary: 'Hard delete action',
  security: [{ bearerAuth: [] }],
  request: {
    query: idParamsSchema.openapi({
      example: { id: 'action-uuid-123' },
    }),
  },
  responses: {
    200: {
      description: 'Deleted permanently',
      content: {
        'application/json': {
          schema: simpleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Action permanent delete successful',
            },
          }),
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
      404: 'UnauthorizedError',
    }),
  },
});

// option-list
registry.registerPath({
  method: 'get',
  path: '/action/options',
  tags: ['Action'],
  summary: 'Get all action options (id and name only)',
  description:
    'Returns a simplified list of actions for dropdown selection when assigning permissions.',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'List of action options',
      content: {
        'application/json': {
          schema: actionOptionListResponseSchema.openapi({
            example: {
              status: 'success',
              data: [
                { id: 'action-uuid-123', name: 'read', displayName: 'read' },
                { id: 'action-uuid-456', name: 'update', displayName: 'update' },
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
