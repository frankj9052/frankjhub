import { registry } from '../../../config/openapiRegistry';
import {
  buildErrorResponses,
  idParamsSchema,
  organizationCreateRequestSchema,
  organizationDataExample,
  organizationListRequestSchema,
  organizationListResponseExample,
  organizationListResponseSchema,
  organizationSingleResponseSchema,
  organizationUpdateRequestSchema,
} from '@frankjhub/shared-schema';

// ----------------- SCHEMA REGISTRATIONS -----------------

// ----------------- PATH REGISTRATIONS -----------------
// create
registry.registerPath({
  method: 'post',
  path: '/organization',
  tags: ['Organization'],
  summary: 'Create a new organization',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: organizationCreateRequestSchema.openapi({
            example: {
              name: 'North York Clinic',
              description: 'A Chinese medicine clinic in Toronto',
              orgTypeId: 'org-type-uuid-123',
            },
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Organization created successfully',
      content: {
        'application/json': {
          schema: organizationSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'create successful',
              data: organizationDataExample,
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
  path: '/organization/list',
  tags: ['Organization'],
  summary: 'Get all organizations (paginated)',
  description: 'Returns a paginated list of all organizations.',
  security: [{ bearerAuth: [] }],
  request: {
    query: organizationListRequestSchema.openapi({
      example: {
        limit: 10,
        offset: 0,
        search: 'North',
        filters: ['active'],
      },
    }),
  },
  responses: {
    200: {
      description: 'List returned',
      content: {
        'application/json': {
          schema: organizationListResponseSchema.openapi({
            example: organizationListResponseExample,
          }),
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
    }),
  },
});

// get org by id
registry.registerPath({
  method: 'get',
  path: '/organization/{id}',
  tags: ['Organization'],
  summary: 'Get organization by ID',
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
      description: 'Organization ID',
    },
  ],
  responses: {
    200: {
      description: 'Organization found',
      content: {
        'application/json': {
          schema: organizationSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Get organization by id successful',
              data: organizationDataExample,
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
  path: '/organization/update',
  tags: ['Organization'],
  summary: 'Update organization',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: organizationUpdateRequestSchema.openapi({
            example: {
              id: 'org-uuid-123',
              name: 'Downtown Chinese Clinic',
              description: 'Updated clinic name and description',
              orgTypeId: 'org-type-uuid-123',
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
          schema: organizationSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Updated successfully',
              data: organizationDataExample,
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

// soft delete
registry.registerPath({
  method: 'patch',
  path: '/organization/soft-delete',
  tags: ['Organization'],
  summary: 'Soft delete organization',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: idParamsSchema.openapi({
            example: { id: 'org-uuid-123' },
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
          schema: organizationSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Soft deleted successfully',
              data: organizationDataExample,
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
  path: '/organization/restore',
  tags: ['Organization'],
  summary: 'Restore soft-deleted organization',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: idParamsSchema.openapi({
            example: { id: 'org-uuid-123' },
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
          schema: organizationSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Restored successfully',
              data: organizationDataExample,
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

// hard delete
registry.registerPath({
  method: 'delete',
  path: '/organization/hard-delete',
  tags: ['Organization'],
  summary: 'Hard delete organization',
  security: [{ bearerAuth: [] }],
  request: {
    query: idParamsSchema.openapi({
      example: { id: 'org-uuid-123' },
    }),
  },
  responses: {
    200: {
      description: 'Deleted permanently',
      content: {
        'application/json': {
          schema: organizationSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Deleted permanently',
              data: organizationDataExample,
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

// get org options
registry.registerPath({
  method: 'get',
  path: '/organization/options',
  tags: ['Organization'],
  summary: 'Get all organization options (id and name only)',
  description: 'Returns a simplified list of active organizations for dropdown selection.',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'List of organization options',
      content: {
        'application/json': {
          schema: organizationSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Get list of organization options',
              data: organizationDataExample,
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
