import { ServiceRouteCreateRequest } from '../request';

export const serviceRouteCreateRequestData: ServiceRouteCreateRequest = {
  path: '/api/users',
  serviceId: 'svc-12345',
  methods: ['GET', 'POST'],
  routeRuleType: 'prefix',
  rewrite: null,
  rateLimit: {
    windowMs: 60000, // 1 分钟
    max: 100, // 最大请求数
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: 'userId',
  },
  isActive: true,
};
