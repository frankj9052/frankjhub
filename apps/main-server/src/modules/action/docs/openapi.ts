import { registry } from '../../../config/openapiRegistry';
import {
  actionCreateRequestSchema,
  actionUpdateRequestSchema,
  actionListRequestSchema,
  idParamsSchema,
  actionOptionListResponseSchema,
  actionSchema,
  actionDataExample,
  actionListResponseSchema,
  actionListResponseExample,
  actionSingleResponseSchema,
} from '@frankjhub/shared-schema';

// ----------------- SCHEMA REGISTRATIONS -----------------

registry.register(
  'Action',
  actionSchema.openapi({
    description: 'An action object with metadata',
    example: actionDataExample,
  })
);

registry.register(
  'ActionListResponse',
  actionListResponseSchema.openapi({
    description: 'Paginated list of actions',
    example: actionListResponseExample,
  })
);

registry.register(
  'ActionSingleResponse',
  actionSingleResponseSchema.openapi({
    description: 'Generic success response',
    example: {
      status: 'success',
      message: 'Action updated successfully',
      data: actionDataExample,
    },
  })
);

// ----------------- PATH REGISTRATIONS -----------------

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
            example: {
              name: 'read',
              description: 'Allows reading the resource',
            },
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
          schema: { $ref: '#/components/schemas/ActionSingleResponse' },
        },
      },
    },
    401: { description: 'Unauthorized' },
    400: { description: 'Validation error' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/action/list',
  tags: ['Action'],
  summary: 'Get all actions (paginated)',
  description: 'Returns a paginated list of all actions.',
  security: [{ bearerAuth: [] }],
  request: {
    query: actionListRequestSchema.openapi({
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
          schema: { $ref: '#/components/schemas/ActionListResponse' },
        },
      },
    },
    401: { description: 'Unauthorized' },
  },
});

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
          schema: { $ref: '#/components/schemas/ActionSingleResponse' },
        },
      },
    },
    404: { description: 'Not found' },
    401: { description: 'Unauthorized' },
  },
});

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
          schema: { $ref: '#/components/schemas/ActionSingleResponse' },
        },
      },
    },
    404: { description: 'Not found' },
    401: { description: 'Unauthorized' },
  },
});

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
          schema: { $ref: '#/components/schemas/ActionSingleResponse' },
        },
      },
    },
    404: { description: 'Not found' },
    401: { description: 'Unauthorized' },
  },
});

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
          schema: { $ref: '#/components/schemas/ActionSingleResponse' },
        },
      },
    },
    404: { description: 'Not found' },
    401: { description: 'Unauthorized' },
  },
});

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
          schema: { $ref: '#/components/schemas/ActionSingleResponse' },
        },
      },
    },
    404: { description: 'Not found' },
    401: { description: 'Unauthorized' },
  },
});

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
                { id: 'action-uuid-123', name: 'read' },
                { id: 'action-uuid-456', name: 'update' },
              ],
            },
          }),
        },
      },
    },
    401: { description: 'Unauthorized' },
  },
});
