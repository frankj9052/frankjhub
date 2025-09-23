export const EMAIL_SUPPRESSION_REASON = {
  BOUNCE: 'bounce',
  COMPLAINT: 'complaint',
  UNSUBSCRIBE: 'unsubscribe',
  MANUAL: 'manual',
} as const;

export type EmailSuppressionReason =
  (typeof EMAIL_SUPPRESSION_REASON)[keyof typeof EMAIL_SUPPRESSION_REASON];
