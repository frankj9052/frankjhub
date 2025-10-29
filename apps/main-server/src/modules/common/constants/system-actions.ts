import { ActionCreateRequest } from '@frankjhub/shared-schema';

export const SYSTEM_ACTIONS: Record<string, ActionCreateRequest> = {
  ALL: {
    name: '*',
    displayName: 'All',
    description: 'All actions',
  },
  CREATE: {
    name: 'create',
    displayName: 'Create',
    description: 'Create new resource',
  },
  READ: {
    name: 'read',
    displayName: 'Read',
    description: 'Read resource data',
  },
  UPDATE: {
    name: 'update',
    displayName: 'Update',
    description: 'Update existing resource',
  },
  DELETE: {
    name: 'delete',
    displayName: 'Delete',
    description: 'Delete resource',
  },
  SOFT_DELETE: {
    name: 'soft-delete',
    displayName: 'Soft Delete',
    description: 'Soft delete data',
  },
  HARD_DELETE: {
    name: 'hard-delete',
    displayName: 'Hard Delete',
    description: 'Delete data permanently',
  },
  RESTORE: {
    name: 'restore',
    displayName: 'Restore',
    description: 'Restore data from soft delete',
  },
} as const;

export type SystemActionName = (typeof SYSTEM_ACTIONS)[keyof typeof SYSTEM_ACTIONS]['name'];
