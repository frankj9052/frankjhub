import { z } from '../../../../libs/z';
import { CAMEL_RE } from '../../constants';

/** entity（camel 命名建议） */
export const entitySchema = z
  .string()
  .trim()
  .min(1, 'entity is required')
  .max(100)
  .regex(CAMEL_RE, 'Entity should use camelCase style');
