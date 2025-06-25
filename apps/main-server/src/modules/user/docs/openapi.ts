import { registry } from '../../../config/openapiRegistry';
import {
  userAllProfilePaginatedResponseSchema,
  userAllProfilePaginationSchema,
  userProfileResponseSchema,
  userAllProfileResponseSchema,
  userAllData,
  userBasicData,
  createSuccessResponseSchema,
  userIdParamsSchema,
  userAdminUpdateSchema,
  adminUpdateUserExample,
} from '@frankjhub/shared-schema';

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

// 注册统一成功响应 schema（可复用）
registry.register(
  'SuccessResponse',
  createSuccessResponseSchema().openapi({
    description: 'Generic success response with optional message and data',
    example: {
      status: 'success',
      message: 'User updated successfully',
      data: { id: '123', name: 'Alice' },
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

// 取用户全部数据
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
          schema: {
            $ref: '#/components/schemas/UserAllProfileResponse',
          },
        },
      },
    },
    401: {
      description: 'Unauthorized - user is not authenticated.',
    },
    403: {
      description: 'Forbidden - user lacks the required permission.',
    },
    404: {
      description: 'User not found.',
    },
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
          schema: userIdParamsSchema.openapi({
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
          schema: { $ref: '#/components/schemas/SuccessResponse' },
        },
      },
    },
    401: { description: 'Unauthorized.' },
    404: { description: 'User not found.' },
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
          schema: userIdParamsSchema.openapi({
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
          schema: { $ref: '#/components/schemas/SuccessResponse' },
        },
      },
    },
    401: { description: 'Unauthorized.' },
    404: { description: 'User not found.' },
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
          schema: userIdParamsSchema.openapi({
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
          schema: { $ref: '#/components/schemas/SuccessResponse' },
        },
      },
    },
    401: { description: 'Unauthorized.' },
    404: { description: 'User not found.' },
  },
});

// 管理员更新用户信息
registry.registerPath({
  method: 'patch',
  path: '/user/admin-update',
  tags: ['User'],
  summary: 'Update user by admin',
  description: 'Allows privileged roles to update user fields including isActive and deletedAt.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: userAdminUpdateSchema.openapi({
            example: adminUpdateUserExample,
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
          schema: { $ref: '#/components/schemas/SuccessResponse' },
        },
      },
    },
    401: { description: 'Unauthorized.' },
    404: { description: 'User not found.' },
  },
});
