import { z } from 'zod';
import { registry } from '../../../config/openapiRegistry';
import {
  buildErrorResponses,
  idParamsSchema,
  serviceCreateRequestData,
  serviceCreateRequestSchema,
  serviceDetailData,
  serviceDetailResponseSchema,
  serviceListRequestData,
  serviceListRequestSchema,
  serviceListResponseData,
  serviceListResponseSchema,
  serviceLoginResponseSchema,
  serviceLoginSchema,
  serviceUpdateRequestData,
  serviceUpdateRequestSchema,
  simpleResponseSchema,
} from '@frankjhub/shared-schema';

// ✅ 注册 /auth/service-login 路由文档
registry.registerPath({
  method: 'post',
  path: '/auth/service-login',
  tags: ['Service Auth'],
  summary: 'Service Login: Obtain JWT Access Token',
  request: {
    body: {
      description: 'Service ID and its Secret',
      required: true,
      content: {
        'application/json': {
          schema: serviceLoginSchema.openapi({
            example: {
              serviceId: 'booking',
              serviceSecret: 'booking-service-secret',
            },
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Login successful, returns JWT access token',
      content: {
        'application/json': {
          schema: serviceLoginResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Service login successful',
              data: {
                token: 'booking-service-token',
              },
            },
          }),
        },
      },
    },
    401: {
      description: 'Authentication failed (invalid serviceId or secret)',
    },
  },
});

// ✅ 注册 /.well-known/jwks.json 路由文档（通用）
registry.registerPath({
  method: 'get',
  path: '/.well-known/jwks.json',
  tags: ['Service Auth'],
  summary: 'JWKS Public Keys: For Verifying RS256 JWTs',
  responses: {
    200: {
      description: 'Public key list in RFC7517-compliant JSON format',
      content: {
        'application/json': {
          schema: z.object({
            keys: z.array(
              z.object({
                kty: z.string(),
                use: z.string().optional(),
                kid: z.string().optional(),
                alg: z.string().optional(),
                n: z.string(),
                e: z.string(),
              })
            ),
          }),
        },
      },
    },
  },
});

// 发布快照
registry.registerPath({
  method: 'get',
  path: '/registry/snapshot',
  tags: ['Service Auth'],
  summary: 'Get active services snapshot for the API Gateway',
  description:
    'Return the current active services snapshot for the gateway to consume. Requires a valid **x-api-key** header.',
  // 声明必须的 header 参数 x-api-key
  parameters: [
    {
      in: 'header',
      name: 'x-api-key',
      required: true,
      description: 'Registry API key. Must match server-side env.REGISTRY_API_KEY.',
      schema: { type: 'string' },
    },
  ],
  responses: {
    200: {
      description: 'Snapshot fetched successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['success'] },
              message: { type: 'string' },
              data: {
                type: 'object',
                properties: {
                  version: { type: 'number', description: 'Unix timestamp (ms) of this snapshot' },
                  services: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        key: { type: 'string', description: 'Service natural key, e.g. "booking"' },
                        aud: { type: 'string', description: 'Audience, e.g. "api://booking"' },
                        baseUrl: { type: 'string', description: 'Service base URL' },
                        requiredScopes: {
                          type: 'array',
                          items: { type: 'string' },
                          description: 'Service-level minimal required scopes (if any)',
                        },
                        routes: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              path: { type: 'string' },
                              methods: {
                                type: 'array',
                                items: {
                                  type: 'string',
                                  description: 'HTTP method (GET/POST/...)',
                                },
                              },
                              requiredScopes: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Route-level required scopes',
                              },
                              rewrite: { type: 'string', nullable: true },
                              rateLimit: {
                                type: 'object',
                                nullable: true,
                                properties: {
                                  windowMs: { type: 'number' },
                                  max: { type: 'number' },
                                },
                                additionalProperties: false,
                              },
                            },
                            required: ['path', 'methods', 'requiredScopes'],
                            additionalProperties: false,
                          },
                        },
                      },
                      required: ['key', 'aud', 'baseUrl', 'routes'],
                      additionalProperties: false,
                    },
                  },
                },
                required: ['version', 'services'],
                additionalProperties: false,
              },
            },
            required: ['status', 'message', 'data'],
            additionalProperties: false,
          },
          examples: {
            success: {
              summary: 'Example snapshot',
              value: {
                status: 'success',
                message: 'Get service snapshot successful',
                data: {
                  version: 1727972400000,
                  services: [
                    {
                      key: 'booking',
                      aud: 'api://booking',
                      baseUrl: 'http://localhost:4101',
                      requiredScopes: ['booking:read'],
                      routes: [
                        {
                          path: '/appointments',
                          methods: ['GET', 'POST'],
                          requiredScopes: ['booking:read', 'booking:write'],
                          rewrite: '^/booking',
                          rateLimit: { windowMs: 60000, max: 120 },
                        },
                      ],
                    },
                    {
                      key: 'shift',
                      aud: 'api://shift',
                      baseUrl: 'http://localhost:4102',
                      requiredScopes: [],
                      routes: [
                        {
                          path: '/shifts',
                          methods: ['GET'],
                          requiredScopes: ['shift:read'],
                        },
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
      500: 'InternalServerError',
    }),
  },
});

// create
registry.registerPath({
  method: 'post',
  path: '/service',
  tags: ['Service Auth - Admin'],
  summary: 'Create a new Service',
  description:
    'Create a service entry. Requires appropriate permission via middleware. Returns a simple success message.',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: serviceCreateRequestSchema.openapi({
            example: serviceCreateRequestData,
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Service created',
      content: {
        'application/json': {
          schema: simpleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Created service "booking"',
            },
          }),
        },
      },
    },
    ...buildErrorResponses({
      400: 'BadRequestError', // 已存在或校验失败
      401: 'UnauthorizedError',
      403: 'ForbiddenError',
      500: 'InternalServerError',
    }),
  },
});

/* List Services */
registry.registerPath({
  method: 'get',
  path: '/service/list',
  tags: ['Service Auth - Admin'],
  summary: 'List services with pagination & filters',
  description:
    'Query services with pagination, optional search, and status filters. Requires permission.',
  request: {
    query: serviceListRequestSchema.openapi({
      example: serviceListRequestData,
    }),
  },
  responses: {
    200: {
      description: 'Service list with pagination',
      content: {
        'application/json': {
          schema: serviceListResponseSchema.openapi({
            example: serviceListResponseData,
          }),
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
      403: 'ForbiddenError',
      500: 'InternalServerError',
    }),
  },
});

/* Update Service */
registry.registerPath({
  method: 'patch',
  path: '/service/update',
  tags: ['Service Auth - Admin'],
  summary: 'Update a service by id',
  description:
    'Partial update of a service (by id). Only provided fields are updated. Requires permission.',
  request: {
    params: idParamsSchema.openapi({
      example: {
        id: 'd9f1c3a2-4b7e-4f8b-8a2d-6c1b9e2f7f45',
      },
    }),
    body: {
      required: true,
      content: {
        'application/json': {
          schema: serviceUpdateRequestSchema.openapi({
            example: serviceUpdateRequestData,
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Service updated',
      content: {
        'application/json': {
          schema: simpleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Service update successful',
            },
          }),
        },
      },
    },
    ...buildErrorResponses({
      400: 'BadRequestError',
      401: 'UnauthorizedError',
      403: 'ForbiddenError',
      404: 'NotFoundError',
      500: 'InternalServerError',
    }),
  },
});

/* Soft Delete Service */
registry.registerPath({
  method: 'patch',
  path: '/service/soft-delete',
  tags: ['Service Auth - Admin'],
  summary: 'Soft delete a service',
  description:
    'Mark a service as deleted (sets deletedAt/deletedBy). Requires permission. Body carries the id.',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: idParamsSchema.openapi({
            example: { id: '3d2c0a23-3c8c-4a8b-9c7a-0c5cda7a1111' },
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Service soft-deleted',
      content: {
        'application/json': {
          schema: simpleResponseSchema,
          examples: {
            ok: {
              value: {
                status: 'success',
                message: 'Service booking soft deleted by admin',
              },
            },
          },
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
      403: 'ForbiddenError',
      404: 'NotFoundError',
      500: 'InternalServerError',
    }),
  },
});

/* Restore Service */
registry.registerPath({
  method: 'patch',
  path: '/service/restore',
  tags: ['Service Auth - Admin'],
  summary: 'Restore a soft-deleted service',
  description:
    'Restore a previously soft-deleted service. If the service is not deleted, returns a success message stating so.',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: idParamsSchema.openapi({
            example: { id: '3d2c0a23-3c8c-4a8b-9c7a-0c5cda7a1111' },
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Service restored or no-op if not deleted',
      content: {
        'application/json': {
          schema: simpleResponseSchema,
          examples: {
            restored: {
              value: {
                status: 'success',
                message: 'Service booking restored by admin',
              },
            },
            notDeleted: {
              value: {
                status: 'success',
                message: 'Service booking is not deleted',
              },
            },
          },
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
      403: 'ForbiddenError',
      404: 'NotFoundError',
      500: 'InternalServerError',
    }),
  },
});

/* Hard Delete Service */
registry.registerPath({
  method: 'delete',
  path: '/service/hard-delete',
  tags: ['Service Auth - Admin'],
  summary: 'Hard delete a service (permanent)',
  description:
    'Permanently remove a service. **id** is passed via query string. Requires permission.',
  request: {
    query: idParamsSchema.openapi({
      example: { id: '3d2c0a23-3c8c-4a8b-9c7a-0c5cda7a1111' },
    }),
  },
  responses: {
    200: {
      description: 'Service hard-deleted',
      content: {
        'application/json': {
          schema: simpleResponseSchema,
          examples: {
            ok: {
              value: {
                status: 'success',
                message: 'Service booking deleted permanently',
              },
            },
          },
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
      403: 'ForbiddenError',
      404: 'NotFoundError',
      500: 'InternalServerError',
    }),
  },
});

/** Get service by ID */
registry.registerPath({
  method: 'get',
  path: '/service/{id}',
  tags: ['Service Auth - Admin'],
  summary: 'Get service details by ID',
  description:
    'Fetch a single service record by its unique ID. Includes soft-deleted entries as well. Requires appropriate permission.',
  parameters: [
    {
      in: 'path',
      name: 'id',
      required: true,
      description: 'UUID of the service to retrieve',
      schema: { type: 'string', format: 'uuid' },
      example: '3d2c0a23-3c8c-4a8b-9c7a-0c5cda7a1111',
    },
  ],
  responses: {
    200: {
      description: 'Service fetched successfully',
      content: {
        'application/json': {
          schema: serviceDetailResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Service detail get successful',
              data: serviceDetailData,
            },
          }),
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
      403: 'ForbiddenError',
      404: 'NotFoundError',
      500: 'InternalServerError',
    }),
  },
});
