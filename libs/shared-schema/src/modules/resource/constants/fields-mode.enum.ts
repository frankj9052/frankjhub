import { z, zInfer } from '../../../libs/z';

/** 资源字段选择策略 */
export const FIELDS_MODE = {
  ALL: 'all', // 等同 "*"（字段不限）
  WHITELIST: 'whitelist', // 仅允许列入 fields 的字段
} as const;

export const fieldsModeSchema = z.nativeEnum(FIELDS_MODE);
export type FieldsMode = zInfer<typeof fieldsModeSchema>;
