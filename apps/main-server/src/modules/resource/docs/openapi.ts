import { registry } from '../../../config/openapiRegistry';
import {
  resourceUpdateRequestSchema,
  resourceListRequestSchema,
  resourceOptionListResponseSchema,
  resourceListResponseSchema,
  buildErrorResponses,
  resourceListRequestData,
  resourceListResponseData,
  resourceDetailResponseSchema,
  resourceDetailData,
  resourceUpdateRequestData,
  simpleResponseSchema,
  resourceOptionListResponseData,
  idParamsSchema,
} from '@frankjhub/shared-schema';

// ----------------- PATH REGISTRATIONS -----------------

// create
// registry.registerPath({
//   method: 'post',
//   path: '/resource',
//   tags: ['Resource'],
//   summary: 'Create a new resource',
//   security: [{ bearerAuth: [] }],
//   request: {
//     body: {
//       content: {
//         'application/json': {
//           schema: resourceCreateRequestSchema.openapi({
//             example: {
//               name: 'patient',
//               description: 'Patient-related data access',
//             },
//           }),
//         },
//       },
//     },
//   },
//   responses: {
//     201: {
//       description: 'Resource created successfully',
//       content: {
//         'application/json': {
//           schema: resourceSingleResponseSchema.openapi({
//             example: {
//               status: 'success',
//               message: 'Resource create successful',
//               data: resourceDataExample,
//             },
//           }),
//         },
//       },
//     },
//     ...buildErrorResponses({
//       400: 'ValidationError',
//       401: 'UnauthorizedError',
//     }),
//   },
// });

// list
registry.registerPath({
  method: 'get',
  path: '/resource/list',
  tags: ['Resource'],
  summary: 'Get all resources (paginated)',
  description: 'Returns a paginated list of all resources.',
  security: [{ bearerAuth: [] }],
  request: {
    query: resourceListRequestSchema.openapi({
      example: resourceListRequestData,
    }),
  },
  responses: {
    200: {
      description: 'List returned',
      content: {
        'application/json': {
          schema: resourceListResponseSchema.openapi({
            example: resourceListResponseData,
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
  path: '/resource/{id}',
  tags: ['Resource'],
  summary: 'Get resource by ID',
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
      description: 'Resource ID',
    },
  ],
  responses: {
    200: {
      description: 'Resource found',
      content: {
        'application/json': {
          schema: resourceDetailResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'get resource successful',
              data: resourceDetailData,
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
  path: '/resource/update',
  tags: ['Resource'],
  summary: 'Update resource',
  security: [{ bearerAuth: [] }],
  request: {
    params: idParamsSchema.openapi({
      example: {
        id: 'd9f1c3a2-4b7e-4f8b-8a2d-6c1b9e2f7f45',
      },
    }),
    body: {
      content: {
        'application/json': {
          schema: resourceUpdateRequestSchema.openapi({
            example: resourceUpdateRequestData,
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
              message: 'Resource update successful',
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
// registry.registerPath({
//   method: 'patch',
//   path: '/resource/soft-delete',
//   tags: ['Resource'],
//   summary: 'Soft delete resource',
//   security: [{ bearerAuth: [] }],
//   request: {
//     body: {
//       content: {
//         'application/json': {
//           schema: idParamsSchema.openapi({
//             example: { id: 'resource-uuid-123' },
//           }),
//         },
//       },
//     },
//   },
//   responses: {
//     200: {
//       description: 'Soft deleted successfully',
//       content: {
//         'application/json': {
//           schema: resourceSingleResponseSchema.openapi({
//             example: {
//               status: 'success',
//               message: 'Resource delete successful',
//               data: resourceDataExample,
//             },
//           }),
//         },
//       },
//     },
//     ...buildErrorResponses({
//       401: 'UnauthorizedError',
//       404: 'NotFoundError',
//     }),
//   },
// });

// restore
// registry.registerPath({
//   method: 'patch',
//   path: '/resource/restore',
//   tags: ['Resource'],
//   summary: 'Restore soft-deleted resource',
//   security: [{ bearerAuth: [] }],
//   request: {
//     body: {
//       content: {
//         'application/json': {
//           schema: idParamsSchema.openapi({
//             example: { id: 'resource-uuid-123' },
//           }),
//         },
//       },
//     },
//   },
//   responses: {
//     200: {
//       description: 'Restored successfully',
//       content: {
//         'application/json': {
//           schema: resourceSingleResponseSchema.openapi({
//             example: {
//               status: 'success',
//               message: 'Resource restore successful',
//               data: resourceDataExample,
//             },
//           }),
//         },
//       },
//     },
//     ...buildErrorResponses({
//       401: 'UnauthorizedError',
//       404: 'NotFoundError',
//     }),
//   },
// });

// hard-delete
// registry.registerPath({
//   method: 'delete',
//   path: '/resource/hard-delete',
//   tags: ['Resource'],
//   summary: 'Hard delete resource',
//   security: [{ bearerAuth: [] }],
//   request: {
//     query: idParamsSchema.openapi({
//       example: { id: 'resource-uuid-123' },
//     }),
//   },
//   responses: {
//     200: {
//       description: 'Deleted permanently',
//       content: {
//         'application/json': {
//           schema: resourceSingleResponseSchema.openapi({
//             example: {
//               status: 'success',
//               message: 'Resource permanent delete successful',
//               data: resourceDataExample,
//             },
//           }),
//         },
//       },
//     },
//     ...buildErrorResponses({
//       401: 'UnauthorizedError',
//       404: 'NotFoundError',
//     }),
//   },
// });

// option-list
registry.registerPath({
  method: 'get',
  path: '/resource/options',
  tags: ['Resource'],
  summary: 'Get all resource options (id and name only)',
  description: 'Returns a simplified list of resources for dropdown selection.',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'List of resource options',
      content: {
        'application/json': {
          schema: resourceOptionListResponseSchema.openapi({
            example: resourceOptionListResponseData,
          }),
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
    }),
  },
});
