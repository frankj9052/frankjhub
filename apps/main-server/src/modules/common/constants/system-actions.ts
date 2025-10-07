export const SYSTEM_ACTIONS = {
  ALL: {
    name: '*',
    description: 'All actions',
  },
  CREATE: {
    name: 'create',
    description: 'Create new resource',
  },
  READ: {
    name: 'read',
    description: 'Read resource data',
  },
  UPDATE: {
    name: 'update',
    description: 'Update existing resource',
  },
  DELETE: {
    name: 'delete',
    description: 'Delete resource',
  },
  SOFT_DELETE: {
    name: 'soft-delete',
    description: 'Soft delete data',
  },
  HARD_DELETE: {
    name: 'hard-delete',
    description: 'Delete data permanently',
  },
  RESTORE: {
    name: 'restore',
    description: 'Restore data from soft delete,',
  },
} as const;

export type SystemActionName = (typeof SYSTEM_ACTIONS)[keyof typeof SYSTEM_ACTIONS]['name'];
