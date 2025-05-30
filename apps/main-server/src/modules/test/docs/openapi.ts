import z from 'zod';
import { registry } from '../../../config/openapiRegistry';

// ✅ 注册 API 文档（使用 OpenAPIRegistry）
registry.registerPath({
  method: 'get',
  path: '/test',
  tags: ['Test'],
  summary: '测试 API 是否存活',
  responses: {
    200: {
      description: 'OK',
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
