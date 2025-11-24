import { ResourceCreateRequest } from '@frankjhub/shared-schema';
import { SYSTEM_SERVICE_KEY_LIST, SYSTEM_SERVICES, SystemServiceKey } from './system-services';

export const SYSTEM_RESOURCE_KEY_LIST = [...SYSTEM_SERVICE_KEY_LIST] as const;
export type SystemResourceKey = (typeof SYSTEM_RESOURCE_KEY_LIST)[number];

export const SYSTEM_RESOURCES: Record<SystemResourceKey, ResourceCreateRequest> = {
  // ALL: {
  //   namespace: SYSTEM_SERVICES.SYSTEM.serviceId,
  //   entity: '*',
  //   qualifier: '*',
  //   fieldsMode: 'all',
  //   fields: [],
  //   isActive: true,
  // },
  // 其余服务通配资源
  ...(Object.fromEntries(
    Object.keys(SYSTEM_SERVICES).map(key => {
      const service = SYSTEM_SERVICES[key as SystemServiceKey];
      const resource: ResourceCreateRequest = {
        namespace: service.serviceId,
        entity: '*',
        qualifier: '*',
        fieldsMode: 'all',
        fields: [],
        isActive: true,
      };
      return [key, resource];
    })
  ) as Record<SystemServiceKey, ResourceCreateRequest>),
} as const;
