import { z } from 'zod';
import { registry } from '../../../config/openapiRegistry';

// ✅ Schema: service-login 请求体
const serviceLoginSchema = z.object({
  serviceId: z.string().openapi({ example: 'main-server' }),
  serviceSecret: z.string().openapi({ example: 'abc123' }),
});

// ✅ Schema: service-login 成功响应
const serviceLoginResponseSchema = z.object({
  status: z.literal('success'),
  data: z.object({
    token: z.string().describe('JWT access token (RS256 signed)'),
  }),
});

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
          schema: serviceLoginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Login successful, returns JWT access token',
      content: {
        'application/json': {
          schema: serviceLoginResponseSchema,
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
