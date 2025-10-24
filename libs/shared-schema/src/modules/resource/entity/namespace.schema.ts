import { z } from '../../../libs/z';

/** serviceId = namespace（建议小写字母、数字、连字符） */
export const namespaceSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(
    /^[a-z0-9][a-z0-9-]*$/,
    'The namespace should consist of lowercase letters, numbers, or hyphens, and must start with a letter or number.'
  );
