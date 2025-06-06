import z from 'zod';
import { registry } from '../../../config/openapiRegistry';

// ✅ 注册 API 文档（使用 OpenAPIRegistry）
registry.registerPath({
  method: 'get',
  path: '/test',
  tags: ['Test'],
  summary: 'Check if the API is alive',
  responses: {
    200: {
      description: 'Server is running normally',
      content: {
        'application/json': {
          schema: z.object({
            status: z.literal('ok'),
          }),
        },
      },
    },
  },
});
