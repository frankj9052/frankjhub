import { ServiceRouteUpdateRequest } from '../request';

export const serviceRouteUpdateRequestData: ServiceRouteUpdateRequest = {
  path: '/api/users/:id',
  methods: ['GET', 'PUT', 'DELETE'],
  routeRuleType: 'exact',
  rewrite: '/api/v2/users/:id',
  rateLimit: {
    windowMs: 120000, // 2 分钟
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: 'userId',
  },
  isActive: false,
};
