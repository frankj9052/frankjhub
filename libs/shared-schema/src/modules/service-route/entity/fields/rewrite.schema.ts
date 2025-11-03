import { z } from '../../../../libs';
import { REWRITE_RE } from '../../constants/regex.constants';

export const rewriteSchema = z
  .string()
  .regex(REWRITE_RE, 'Invalid rewrite pattern')
  .optional()
  .nullable();
