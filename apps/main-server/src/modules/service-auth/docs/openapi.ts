import { z } from 'zod';
import { registry } from '../../../config/openapiRegistry';
import {
  buildErrorResponses,
  serviceLoginResponseSchema,
  serviceLoginSchema,
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
