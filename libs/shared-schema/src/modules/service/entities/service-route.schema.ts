import { httpMethodSchema } from '../../../enums/http_method.enum';
import { z, zInfer } from '../../../libs/z';
import { rateLimitSchema } from './rate-limit.schema';

/**
 * 单条服务路由定义（映射 JSONB 中的元素）
 * - type: 默认为 'exact'（完全匹配）
 * - 当 type = 'prefix' 时使用 pathPrefix
 */
export const serviceRouteSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('exact').optional(), // 默认 exact
    path: z.string().min(1).regex(/^\/.*/, 'must start with /'),
    methods: z.array(httpMethodSchema).min(1, 'Need at least one method'),
    requiredScopes: z.array(z.string()).optional(),
    rewrite: z.string().optional(),
    rateLimit: rateLimitSchema.optional(),
  }),

  z.object({
    type: z.literal('prefix'),
    pathPrefix: z.string().min(1).regex(/^\/.*/, 'must start with /'),
    methods: z.array(httpMethodSchema).min(1, 'Need at least one method'),
    requiredScopes: z.array(z.string()).optional(),
    rewrite: z.string().optional(),
    rateLimit: rateLimitSchema.optional(),
  }),
]);

export type ServiceRoute = zInfer<typeof serviceRouteSchema>;
