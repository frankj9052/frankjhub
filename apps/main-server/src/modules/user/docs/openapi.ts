import { registry } from '../../../config/openapiRegistry';
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
