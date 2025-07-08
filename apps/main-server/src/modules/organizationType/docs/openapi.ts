import { registry } from '../../../config/openapiRegistry';
import {
  buildErrorResponses,
  idParamsSchema,
  organizationTypeCreateRequestSchema,
  organizationTypeDataExample,
  organizationTypeListRequestSchema,
  organizationTypeListResponseExample,
  organizationTypeListResponseSchema,
  organizationTypeOptionListResponseSchema,
  organizationTypeSingleResponseSchema,
  organizationTypeUpdateRequestSchema,
} from '@frankjhub/shared-schema';

// ----------------- PATH REGISTRATIONS -----------------
// create
registry.registerPath({
  method: 'post',
  path: '/organization-type',
  tags: ['OrganizationType'],
  summary: 'Create a new organization type',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: organizationTypeCreateRequestSchema.openapi({
            example: {
              name: 'Clinic',
              description: 'A general clinic',
            },
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Organization type created successfully',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/OrganizationType' },
        },
      },
    },
    ...buildErrorResponses({
      400: 'ValidationError',
      401: 'UnauthorizedError',
    }),
  },
});

// get list
registry.registerPath({
  method: 'get',
  path: '/organization-type/list',
  tags: ['OrganizationType'],
  summary: 'Get all organization types (paginated)',
  description: 'Returns a paginated list of all organization types.',
  security: [{ bearerAuth: [] }],
  request: {
    query: organizationTypeListRequestSchema.openapi({
      example: {
        limit: 20,
        offset: 0,
        search: 'clinic',
        filters: ['active'],
        orderBy: 'name',
      },
    }),
  },
  responses: {
    200: {
      description: 'List returned',
      content: {
        'application/json': {
          schema: organizationTypeListResponseSchema.openapi({
            example: organizationTypeListResponseExample,
          }),
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
    }),
  },
});

// get orgType by id
registry.registerPath({
  method: 'get',
  path: '/organization-type/{id}',
  tags: ['OrganizationType'],
  summary: 'Get organization type by ID',
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
      description: 'Organization type ID',
    },
  ],
  responses: {
    200: {
      description: 'Organization type found',
      content: {
        'application/json': {
          schema: organizationTypeSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'get successful',
              data: organizationTypeDataExample,
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
  path: '/organization-type/update',
  tags: ['OrganizationType'],
  summary: 'Update organization type',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: organizationTypeUpdateRequestSchema.openapi({
            example: {
              id: 'org-type-uuid-123',
              name: 'Hospital',
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
          schema: organizationTypeSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'update successful',
              data: organizationTypeDataExample,
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
  path: '/organization-type/soft-delete',
  tags: ['OrganizationType'],
  summary: 'Soft delete organization type',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: idParamsSchema.openapi({
            example: { id: 'org-type-uuid-123' },
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
          schema: organizationTypeSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'delete successful',
              data: organizationTypeDataExample,
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
  path: '/organization-type/restore',
  tags: ['OrganizationType'],
  summary: 'Restore soft-deleted organization type',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: idParamsSchema.openapi({
            example: { id: 'org-type-uuid-123' },
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
          schema: organizationTypeSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'restore successful',
              data: organizationTypeDataExample,
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
  path: '/organization-type/hard-delete',
  tags: ['OrganizationType'],
  summary: 'Hard delete organization type',
  security: [{ bearerAuth: [] }],
  request: {
    query: idParamsSchema.openapi({
      example: { id: 'org-type-uuid-123' },
    }),
  },
  responses: {
    200: {
      description: 'hard delete successfully',
      content: {
        'application/json': {
          schema: organizationTypeSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'permanent delete successful',
              data: organizationTypeDataExample,
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

// get orgType option list
registry.registerPath({
  method: 'get',
  path: '/organization-type/options',
  tags: ['OrganizationType'],
  summary: 'Get all organization type options (id and name only)',
  description:
    'Returns a simplified list of organization types for dropdown selection when creating an organization.',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'List of organization type options',
      content: {
        'application/json': {
          schema: organizationTypeOptionListResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Get organization type option list successful',
              data: [
                {
                  id: 'org-type-uuid-123',
                  name: 'Clinic',
                },
                {
                  id: 'org-type-uuid-456',
                  name: 'Hospital',
                },
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
