import { z } from '../../../../libs/z';
import { NAMESPACE_RE } from '../../constants';

/** serviceId = namespace（建议小写字母、数字、连字符或*） */
export const namespaceSchema = z
  .string()
  .trim()
  .min(1, 'namespace is required')
  .max(100)
  .refine(
    val => val === '*' || NAMESPACE_RE.test(val),
    'Namespace must match /^[a-z0-9][a-z0-9-]*$/ or be "*"'
  );
