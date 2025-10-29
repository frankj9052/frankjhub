import { z } from '../../../../libs/z';
import { NAMESPACE_RE } from '../../constants';

/** serviceId = namespace（建议小写字母、数字、连字符） */
export const namespaceSchema = z
  .string()
  .trim()
  .min(1, 'namespace is required')
  .max(100)
  .regex(
    NAMESPACE_RE,
    'The namespace should consist of lowercase letters, numbers, or hyphens, and must start with a letter or number.'
  );
