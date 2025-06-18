import { registry } from '../../../config/openapiRegistry';
import {
  userAllProfilePaginatedResponseSchema,
  userAllProfilePaginationSchema,
} from '../dto/userAllProfilePagination.dto';
import { userProfileResponseSchema } from '../dto/userProfile.dto';

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
          schema: userProfileResponseSchema,
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
    query: userAllProfilePaginationSchema,
  },
  responses: {
    200: {
      description: 'Paginated user list successfully returned.',
      content: {
        'application/json': {
          schema: userAllProfilePaginatedResponseSchema,
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
