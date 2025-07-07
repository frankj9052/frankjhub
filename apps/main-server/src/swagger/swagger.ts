import { extendZodWithOpenApi, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import swaggerUi from 'swagger-ui-express';
import { env } from '../config/env';
import { Express } from 'express';
import { registry } from '../config/openapiRegistry';
import { createLoggerWithContext } from '../modules/common/libs/logger';
import { baseErrorExample, baseErrorResponseSchema } from '@frankjhub/shared-schema';

extendZodWithOpenApi(z);

const logger = createLoggerWithContext('Swagger');

// 注册共用组件（提前）
registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

registry.registerComponent('schemas', 'ErrorResponse', {
  ...baseErrorResponseSchema.openapi({
    example: baseErrorExample,
  }),
});

registry.registerComponent('responses', 'NotFound', {
  description: 'Resource not found',
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/ErrorResponse',
      },
    },
  },
});

// 👇 修改为导出函数（延迟执行）
export function generateSwaggerDocs(app: Express) {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  const openapiDocument = generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Main-Server API Documentation',
      version: '1.0.0',
      description:
        'This API documentation is auto-generated based on Zod schemas. The Main Server provides core services including user registration, authentication, multi-tenant organization management, role-based access control (RBAC), and inter-service communication for a distributed platform.',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api`,
        description: 'Development Environment',
      },
      {
        url: 'https://your-domain.com/api',
        description: 'Production Environment',
      },
    ],
    security: [{ bearerAuth: [] }],
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
  const paths = openapiDocument.paths ?? {};
  const count = typeof paths === 'object' ? Object.keys(paths).length : 0;
  logger.info(`✅ Swagger doc registered, total paths: ${count}`);
}
