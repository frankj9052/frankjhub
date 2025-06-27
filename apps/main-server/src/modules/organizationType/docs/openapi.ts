import { registry } from '../../../config/openapiRegistry';
import {
  organizationTypeCreateSchema,
  organizationTypeUpdateSchema,
  organizationTypeSchema,
  organizationTypePaginationSchema,
  organizationTypePaginatedResponseSchema,
  userIdParamsSchema,
  createSuccessResponseSchema,
} from '@frankjhub/shared-schema';

registry.register(
  'OrganizationType',
  organizationTypeSchema.openapi({
    description: 'An organization type object',
    example: {
      id: 'org-type-uuid-123',
      name: 'Clinic',
      description: 'A general clinic or medical center',
      isActive: true,
      createdAt: '2024-06-01T10:00:00Z',
      updatedAt: '2024-06-10T12:00:00Z',
      deletedAt: null,
      createdBy: 'admin',
      updatedBy: 'admin',
      deletedBy: null,
    },
  })
);

registry.register(
  'OrganizationTypePaginatedResponse',
  organizationTypePaginatedResponseSchema.openapi({
    description: 'Paginated list of organization types',
    example: {
      data: [
        {
          id: 'org-type-uuid-123',
          name: 'Clinic',
          description: 'A general clinic or medical center',
          isActive: true,
          createdAt: '2024-06-01T10:00:00Z',
          updatedAt: '2024-06-10T12:00:00Z',
          deletedAt: null,
          createdBy: 'admin',
          updatedBy: 'admin',
          deletedBy: null,
        },
      ],
      total: 1,
      pageCount: 1,
      currentPage: 1,
      pageSize: 10,
    },
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
          schema: userIdParamsSchema.openapi({
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
          schema: userIdParamsSchema.openapi({
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
    query: userIdParamsSchema.openapi({
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
