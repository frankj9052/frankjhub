export const EMAIL_PROVIDER = {
  RESEND: 'resend',
  NODEMAILER: 'nodemailer',
} as const;

export type EmailProvider = (typeof EMAIL_PROVIDER)[keyof typeof EMAIL_PROVIDER];
