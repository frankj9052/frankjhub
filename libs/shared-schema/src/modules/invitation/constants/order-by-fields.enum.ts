export const INVITATION_ORDER_BY_FIELDS = {
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export type InvitationOrderByFIelds =
  (typeof INVITATION_ORDER_BY_FIELDS)[keyof typeof INVITATION_ORDER_BY_FIELDS];
