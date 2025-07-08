import { registry } from '../../../config/openapiRegistry';
import {
  buildErrorResponses,
  idParamsSchema,
  userDataExample,
  userListPageDataExample,
  userListRequestSchema,
  userListResponseSchema,
  userSingleResponseSchema,
  userUpdateRequestDataExample,
  userUpdateRequestSchema,
} from '@frankjhub/shared-schema';

// get current user
registry.registerPath({
  method: 'get',
  path: '/user/current-user',
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
          schema: userSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Get current user data successful',
              data: userDataExample,
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

// get user list
registry.registerPath({
  method: 'get',
  path: '/user/list',
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
    query: userListRequestSchema.openapi({
      description: 'Pagination query parameters for listing all user profiles (limit/offset based)',
      example: {
        limit: 20,
        offset: 0,
        order: 'DESC',
        orderBy: 'createdAt',
        search: 'jurong',
        filters: ['active'],
      },
    }),
  },
  responses: {
    200: {
      description: 'Paginated user list successfully returned.',
      content: {
        'application/json': {
          schema: userListResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Get user list successful',
              data: userListPageDataExample,
            },
          }),
        },
      },
    },
    ...buildErrorResponses({
      401: 'UnauthorizedError',
      500: 'InternalServerError',
    }),
  },
});

// get user by id
registry.registerPath({
  method: 'get',
  path: '/user/{id}',
  tags: ['User'],
  summary: 'Get full profile of a user by ID',
  description: 'Returns full detailed profile data of a specific user by their ID.',
  security: [
    {
      bearerAuth: [], // 或 cookieAuth，看你用的认证方式
    },
  ],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
        format: 'uuid', // 假设你的 ID 是 UUID 类型的
      },
      description: 'User ID to look up',
    },
  ],
  responses: {
    200: {
      description: 'User found and full profile returned.',
      content: {
        'application/json': {
          schema: userSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'Get user by id successful',
              data: userDataExample,
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

// 软删除用户
registry.registerPath({
  method: 'patch',
  path: '/user/soft-delete',
  tags: ['User'],
  summary: 'Soft delete a user',
  description: 'Marks a user as soft-deleted (sets deletedAt and deletedBy).',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: idParamsSchema.openapi({
            example: { id: 'user-uuid-123' },
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User soft-deleted successfully.',
      content: {
        'application/json': {
          schema: userSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'User soft-deleted successfully.',
              data: userDataExample,
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

// 恢复软删除用户
registry.registerPath({
  method: 'patch',
  path: '/user/restore',
  tags: ['User'],
  summary: 'Restore a soft-deleted user',
  description: 'Restores a user by clearing deletedAt and deletedBy.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: idParamsSchema.openapi({
            example: { id: 'user-uuid-123' },
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User restored successfully.',
      content: {
        'application/json': {
          schema: userSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'User restored successfully.',
              data: userDataExample,
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

// 永久删除用户
registry.registerPath({
  method: 'delete',
  path: '/user/hard-delete',
  tags: ['User'],
  summary: 'Hard delete a user',
  description: 'Permanently deletes a user and cascades related records.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: idParamsSchema.openapi({
            example: { id: 'user-uuid-123' },
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User permanently deleted.',
      content: {
        'application/json': {
          schema: userSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'User permanently deleted.',
              data: userDataExample,
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

// 管理员更新用户信息
registry.registerPath({
  method: 'patch',
  path: '/user/update',
  tags: ['User'],
  summary: 'Update user by admin',
  description: 'Allows privileged roles to update user fields including isActive and deletedAt.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: userUpdateRequestSchema.openapi({
            example: userUpdateRequestDataExample,
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User updated successfully.',
      content: {
        'application/json': {
          schema: userSingleResponseSchema.openapi({
            example: {
              status: 'success',
              message: 'User updated successfully.',
              data: userDataExample,
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
