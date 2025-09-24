export const EMAIL_RECEIPT_EVENT = {
  DELIVERED: 'delivered',
  OPENED: 'opened',
  CLICKED: 'clicked',
  BOUNCED: 'bounced',
  COMPLAINED: 'complained',
  SENT: 'sent',
} as const;

export type EmailReceiptEvent = (typeof EMAIL_RECEIPT_EVENT)[keyof typeof EMAIL_RECEIPT_EVENT];
