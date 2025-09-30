import { httpMethodSchema } from '../../../enums/http_method.enum';
import { z, zInfer } from '../../../libs/z';
import { rateLimitSchema } from './rate-limit.schema';

/** 单条路由定义（映射 JSONB 中的元素） */
export const serviceRouteSchema = z.object({
  path: z.string().min(1).regex(/^\/.*/, 'must start with /'),
  methods: z.array(httpMethodSchema).min(1, 'Need at least one method'),
  requiredScopes: z.array(z.string().min(1, 'scope cannot be empty')).default([]),
  /** 反向代理改写表达式（可按你的网关实现约定成正则或前缀） */
  rewrite: z.string().optional(),
  rateLimit: rateLimitSchema.optional(),
});

export type ServiceRoute = zInfer<typeof serviceRouteSchema>;
