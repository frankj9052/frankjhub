import { ActionCreateRequest } from '@frankjhub/shared-schema';

export const SYSTEM_ACTION_KEY_LIST = [
  'ANY',
  'ALL',
  'CREATE',
  'READ',
  'UPDATE',
  'SOFT_DELETE',
  'HARD_DELETE',
  'RESTORE',
  'LIST',
] as const;
export type SystemActionKey = (typeof SYSTEM_ACTION_KEY_LIST)[number];

export const SYSTEM_ACTIONS: Record<SystemActionKey, ActionCreateRequest> = {
  ANY: {
    name: 'any',
    displayName: 'Any',
    description: 'Any actions',
  },
  ALL: {
    name: 'all',
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
    name: 'soft_delete',
    displayName: 'Soft Delete',
    description: 'Soft delete data',
  },
  HARD_DELETE: {
    name: 'hard_delete',
    displayName: 'Hard Delete',
    description: 'Delete data permanently',
  },
  RESTORE: {
    name: 'restore',
    displayName: 'Restore',
    description: 'Restore data from soft delete',
  },
  LIST: {
    name: 'list',
    displayName: 'List',
    description: 'List resources (lightweight, e.g. for options/autocomplete)',
  },
} as const;
