import z from 'zod';
import { registry } from '../../../config/openapiRegistry';
import { loginSchema, currentUserSchema } from '@frankjhub/shared-schema';
import { userPayloadExample } from './examples';

// LoginRequest
registry.register(
  'LoginRequest',
  loginSchema.openapi({
    description: 'Login request body containing user credentials',
    example: {
      email: 'test@example.com',
      password: 'password123',
    },
  })
);

// CurrentUserResponse
registry.register(
  'CurrentUserResponse',
  currentUserSchema.openapi({
    description: 'Response schema containing the current authenticated user information',
    example: {
      status: 'success',
      data: userPayloadExample,
    },
  })
);

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
          schema: {
            $ref: '#/components/schemas/LoginRequest',
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Login successful',
      content: {
        'application/json': {
          schema: {
            $ref: '#components/schemas/CurrentUserResponse',
          },
        },
      },
    },
    401: {
      description: 'Authentication failed (invalid credentials)',
    },
    422: {
      description: 'Validation failed (invalid request body)',
    },
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
          schema: {
            $ref: '#components/schemas/CurrentUserResponse',
          },
        },
      },
    },
    401: {
      description: 'Authentication required. User is not logged in or session is invalid.',
    },
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
          schema: z.object({
            status: z.literal('success'),
            message: z.literal('Logout successful'),
          }),
        },
      },
    },
    500: {
      description: 'Logout failed (server error)',
      content: {
        'application/json': {
          schema: z.object({
            status: z.literal('error'),
            message: z.literal('Logout failed'),
          }),
        },
      },
    },
  },
});
