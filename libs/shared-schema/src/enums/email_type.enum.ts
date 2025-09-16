import { z } from '../libs/z';

export const EMAIL_TYPE = {
  MAIN: 'main',
  SUPPORT: 'support',
  BILLING: 'billing',
} as const;

export type EmailType = (typeof EMAIL_TYPE)[keyof typeof EMAIL_TYPE];
export const emailTypeSchema = z.nativeEnum(EMAIL_TYPE);
