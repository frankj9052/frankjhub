import { ServiceRouteCreateRequest } from '@frankjhub/shared-schema';
import { SYSTEM_SERVICES } from '../../common/constants/system-services';

export const SYSTEM_SERVICE_ROUTE_KEY_LIST = [] as const;

export const SYSTEM_SERVICE_ROUTES: Record<string, ServiceRouteCreateRequest> = {
  LOGIN: {
    path: '/login',
    serviceId: SYSTEM_SERVICES.MAIN.serviceId,
    methods: ['POST'],
    routeRuleType: 'exact',
    rewrite: '',
  },
};
