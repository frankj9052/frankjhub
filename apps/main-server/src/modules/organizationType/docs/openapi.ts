import { registry } from '../../../config/openapiRegistry';
import {
  organizationTypeCreateSchema,
  organizationTypeUpdateSchema,
  organizationTypeSchema,
  organizationTypePaginationSchema,
  organizationTypePaginatedResponseSchema,
  idParamsSchema,
  createSuccessResponseSchema,
  organizationTypeAllDataExample,
  organizationTypePaginatedResponseDataExample,
  orgTypeOptionSchema,
} from '@frankjhub/shared-schema';

registry.register(
  'OrganizationType',
  organizationTypeSchema.openapi({
    description: 'An organization type object',
    example: organizationTypeAllDataExample,
  })
);

registry.register(
  'OrganizationTypePaginatedResponse',
  organizationTypePaginatedResponseSchema.openapi({
    description: 'Paginated list of organization types',
    example: organizationTypePaginatedResponseDataExample,
  })
);

registry.register(
  'SuccessResponse',
  createSuccessResponseSchema().openapi({
    description: 'Generic success response',
    example: {
      status: 'success',
      message: 'OrganizationType updated successfully',
    },
  })
);

registry.register(
  'OrgTypeOption',
  orgTypeOptionSchema.openapi({
    description: 'A lightweight organization type object for dropdown lists',
    example: {
      id: 'org-type-uuid-123',
      name: 'Clinic',
    },
  })
);

// ----------------- PATH REGISTRATIONS -----------------

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
          schema: organizationTypeCreateSchema.openapi({
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
    401: { description: 'Unauthorized' },
    400: { description: 'Validation error' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/organization-type/list',
  tags: ['OrganizationType'],
  summary: 'Get all organization types (paginated)',
  description: 'Returns a paginated list of all organization types.',
  security: [{ bearerAuth: [] }],
  request: {
    query: organizationTypePaginationSchema.openapi({
      example: {
        limit: 20,
        offset: 0,
        search: 'clinic',
      },
    }),
  },
  responses: {
    200: {
      description: 'List returned',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/OrganizationTypePaginatedResponse' },
        },
      },
    },
    401: { description: 'Unauthorized' },
  },
});

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
          schema: { $ref: '#/components/schemas/OrganizationType' },
        },
      },
    },
    404: { description: 'Not found' },
    401: { description: 'Unauthorized' },
  },
});

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
          schema: organizationTypeUpdateSchema.openapi({
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
          schema: { $ref: '#/components/schemas/SuccessResponse' },
        },
      },
    },
    404: { description: 'Not found' },
    401: { description: 'Unauthorized' },
  },
});

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
          schema: { $ref: '#/components/schemas/SuccessResponse' },
        },
      },
    },
    404: { description: 'Not found' },
    401: { description: 'Unauthorized' },
  },
});

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
          schema: { $ref: '#/components/schemas/SuccessResponse' },
        },
      },
    },
    404: { description: 'Not found' },
    401: { description: 'Unauthorized' },
  },
});

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
      description: 'Deleted permanently',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/SuccessResponse' },
        },
      },
    },
    404: { description: 'Not found' },
    401: { description: 'Unauthorized' },
  },
});

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
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'success',
              },
              data: {
                type: 'array',
                items: { $ref: '#/components/schemas/OrgTypeOption' },
                example: [
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
            },
          },
        },
      },
    },
    401: { description: 'Unauthorized' },
  },
});
