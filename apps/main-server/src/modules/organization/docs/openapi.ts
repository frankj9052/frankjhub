import { registry } from '../../../config/openapiRegistry';
import {
  organizationCreateSchema,
  organizationUpdateSchema,
  organizationWithOrgTypeNameSchema,
  organizationPaginatedResponseSchema,
  organizationPaginationSchema,
  idParamsSchema,
  createSuccessResponseSchema,
  organizationWithOrgTypeDataExample,
  organizationPaginatedResponseDataExample,
  orgTypeOptionSchema,
} from '@frankjhub/shared-schema';

// ----------------- SCHEMA REGISTRATIONS -----------------

registry.register(
  'Organization',
  organizationWithOrgTypeNameSchema.openapi({
    description: 'An organization object with org type name',
    example: organizationWithOrgTypeDataExample,
  })
);

registry.register(
  'OrganizationPaginatedResponse',
  organizationPaginatedResponseSchema.openapi({
    description: 'Paginated list of organizations',
    example: organizationPaginatedResponseDataExample,
  })
);

registry.register(
  'SuccessResponse',
  createSuccessResponseSchema().openapi({
    description: 'Generic success response',
    example: {
      status: 'success',
      message: 'Organization updated successfully',
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
  path: '/organization',
  tags: ['Organization'],
  summary: 'Create a new organization',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: organizationCreateSchema.openapi({
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
          schema: { $ref: '#/components/schemas/Organization' },
        },
      },
    },
    401: { description: 'Unauthorized' },
    400: { description: 'Validation error' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/organization/list',
  tags: ['Organization'],
  summary: 'Get all organizations (paginated)',
  description: 'Returns a paginated list of all organizations.',
  security: [{ bearerAuth: [] }],
  request: {
    query: organizationPaginationSchema.openapi({
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
          schema: { $ref: '#/components/schemas/OrganizationPaginatedResponse' },
        },
      },
    },
    401: { description: 'Unauthorized' },
  },
});

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
          schema: { $ref: '#/components/schemas/Organization' },
        },
      },
    },
    404: { description: 'Not found' },
    401: { description: 'Unauthorized' },
  },
});

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
          schema: organizationUpdateSchema.openapi({
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
