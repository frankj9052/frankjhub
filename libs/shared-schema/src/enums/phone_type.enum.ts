import { z } from '../libs/z';

export const PHONE_TYPE = {
  MAIN: 'main',
  FAX: 'fax',
  MOBILE: 'mobile',
} as const;

export type PhoneType = (typeof PHONE_TYPE)[keyof typeof PHONE_TYPE];
export const phoneTypeSchema = z.nativeEnum(PHONE_TYPE);
