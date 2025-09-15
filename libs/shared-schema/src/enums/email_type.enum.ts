export const EMAIL_TYPE = {
  MAIN: 'main',
  SUPPORT: 'support',
  BILLING: 'billing',
} as const;

export type EmailType = (typeof EMAIL_TYPE)[keyof typeof EMAIL_TYPE];
