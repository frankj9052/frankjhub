export const ACTION_ORDER_BY_FIELDS = {
  NAME: 'name',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export type ActionOrderByField =
  (typeof ACTION_ORDER_BY_FIELDS)[keyof typeof ACTION_ORDER_BY_FIELDS];
