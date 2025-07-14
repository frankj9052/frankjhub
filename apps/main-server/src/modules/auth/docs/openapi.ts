import { registry } from '../../../config/openapiRegistry';
import {
  userPayloadExample,
  loginRequestSchema,
  loginResponseSchema,
  buildErrorResponses,
  baseResponseSchema,
} from '@frankjhub/shared-schema';

// ✅ Register API path: /auth/login
registry.registerPath({
  method: 'post',
  path: '/auth/login',
  tags: ['Auth'],
  summary: 'User Login',
  request: {
    body: {
      description: 'Email and password required for login',
      content: {
        'application/json': {
          schema: loginRequestSchema.openapi({
            example: {
              email: 'jurong@noqclinic.com',
              password: 'fake_password',
            },
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Login successful',
      content: {
        'application/json': {
          schema: loginResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Login successful',
              data: userPayloadExample,
            },
          }),
        },
      },
    },
    ...buildErrorResponses({
      401: 'NotAuthorizedError',
      422: 'BadRequestError',
    }),
  },
});

// ✅ Register API path: /auth/current-user
registry.registerPath({
  method: 'get',
  path: '/auth/current-user',
  tags: ['Auth'],
  summary: 'Get Current Authenticated User',
  responses: {
    200: {
      description: 'User is authenticated. Returns session-bound user information.',
      content: {
        'application/json': {
          schema: loginResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Login successful',
              data: userPayloadExample,
            },
          }),
        },
      },
    },
    ...buildErrorResponses({
      401: 'NotAuthorizedError',
    }),
  },
});

// ✅ Register API path: /auth/logout
registry.registerPath({
  method: 'get',
  path: '/auth/logout',
  tags: ['Auth'],
  summary: 'Logout current user',
  responses: {
    200: {
      description: 'Logout successful',
      content: {
        'application/json': {
          schema: baseResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Logout successful',
            },
          }),
        },
      },
    },
    ...buildErrorResponses({
      500: 'InternalServerError',
    }),
  },
});
