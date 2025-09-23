/**
 * TRANSACTIONAL（事务性邮件）
 * MARKETING（营销邮件）
 */
export const EMAIL_CHANNEL = {
  TRANSACTIONAL: 'transactional',
  MARKETING: 'marketing',
} as const;

export type EmailChannel = (typeof EMAIL_CHANNEL)[keyof typeof EMAIL_CHANNEL];
