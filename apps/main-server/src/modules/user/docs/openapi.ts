import { registry } from '../../../config/openapiRegistry';
import {
  userAllProfilePaginatedResponseSchema,
  userAllProfilePaginationSchema,
  userProfileResponseSchema,
  userAllProfileResponseSchema,
} from '@frankjhub/shared-schema';
import { userAllData, userBasicData } from './examples';

// UserProfileResponse
registry.register(
  'UserProfileResponse',
  userProfileResponseSchema.openapi({
    description: 'User basic profile data response object',
    example: {
      status: 'success',
      data: userBasicData,
    },
  })
);

// UserAllProfileResponse
registry.register(
  'UserAllProfileResponse',
  userAllProfileResponseSchema.openapi({
    description: 'Detailed information about a single user profile',
    example: {
      status: 'success',
      data: userAllData,
    },
  })
);

// UserAllProfilePaginatedResponse
registry.register(
  'UserAllProfilePaginatedResponse',
  userAllProfilePaginatedResponseSchema.openapi({
    description: 'Paginated list of user profiles with metadata',
    example: {
      data: [userAllData],
      total: 1,
      pageCount: 1,
      currentPage: 1,
      pageSize: 10,
    },
  })
);

registry.registerPath({
  method: 'get',
  path: '/user/current-user-profile',
  tags: ['User'],
  summary: 'Get current user profile',
  description: 'Returns profile information of the currently authenticated user.',
  security: [
    {
      bearerAuth: [], // 说明需要 token，如果你用的是 cookie 也可以改为 cookieAuth
    },
  ],
  responses: {
    200: {
      description: 'User profile successfully returned.',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/UserProfileResponse',
          },
        },
      },
    },
    401: {
      description: 'Unauthorized - user identity not found or token invalid.',
    },
    404: {
      description: 'User not found in the database.',
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/user/users-all-profile',
  tags: ['User'],
  summary: 'Get all user profiles (paginated)',
  description:
    'Returns a paginated list of user profiles (excluding the currently authenticated user). Supports sorting and pagination.',
  security: [
    {
      bearerAuth: [],
    },
  ],
  request: {
    query: userAllProfilePaginationSchema.openapi({
      description: 'Pagination query parameters for listing all user profiles (limit/offset based)',
      example: {
        limit: 20,
        offset: 0,
        order: 'DESC',
        orderBy: 'createdAt',
      },
    }),
  },
  responses: {
    200: {
      description: 'Paginated user list successfully returned.',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/UserAllProfilePaginatedResponse',
          },
        },
      },
    },
    401: {
      description: 'Unauthorized - user identity not found or token invalid.',
    },
    500: {
      description: 'Internal server error.',
    },
  },
});
