import { buildResourceKey } from '@frankjhub/shared-perm';
import { SYSTEM_ACTIONS } from './system-actions';
import { SYSTEM_RESOURCES } from './system-resources';
import { PermissionCreateRequest } from '@frankjhub/shared-schema';

export const SYSTEM_PERMISSION_KEY_LIST = ['ALL'] as const;
export type SystemPermissionKey = (typeof SYSTEM_PERMISSION_KEY_LIST)[number];

export const SYSTEM_PERMISSIONS: Record<SystemPermissionKey, PermissionCreateRequest> = {
  ALL: {
    resource_key: buildResourceKey({
      namespace: SYSTEM_RESOURCES.SYSTEM.namespace,
      entity: SYSTEM_RESOURCES.SYSTEM.entity,
      qualifier: SYSTEM_RESOURCES.SYSTEM.qualifier ?? undefined,
    }),
    actionName: SYSTEM_ACTIONS.ALL.name,
    description: 'Grant all permissions',
    isActive: true,
    effect: 'allow',
  },
} as const;
