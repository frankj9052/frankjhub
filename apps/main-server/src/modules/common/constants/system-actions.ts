import { ActionCreateRequest } from '@frankjhub/shared-schema';

export const SYSTEM_ACTION_KEY_LIST = [
  'ALL',
  'CREATE',
  'READ',
  'UPDATE',
  'SOFT_DELETE',
  'HARD_DELETE',
  'RESTORE',
] as const;
export type SystemActionKey = (typeof SYSTEM_ACTION_KEY_LIST)[number];

export const SYSTEM_ACTIONS: Record<SystemActionKey, ActionCreateRequest> = {
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
