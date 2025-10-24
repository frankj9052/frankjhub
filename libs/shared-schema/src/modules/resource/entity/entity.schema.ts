import { z } from '../../../libs/z';

/** entity（camel 命名建议） */
export const entitySchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z][A-Za-z0-9]*$/, 'Entity should use camelCase style');
