import { z } from '../../../../libs/z';
import { CAMEL_RE } from '../../constants/regex.constants';

/** 字段名（统一 camel 命名建议） */
export const fieldNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .regex(CAMEL_RE, 'fieldName should use camelCase style');
