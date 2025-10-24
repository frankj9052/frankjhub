import { z } from '../../../libs/z';

/** 字段名（统一 camel 命名建议） */
export const fieldNameSchema = z
  .string()
  .min(1)
  .regex(/^[a-z][A-Za-z0-9]*$/, 'fieldName should use camelCase style');
