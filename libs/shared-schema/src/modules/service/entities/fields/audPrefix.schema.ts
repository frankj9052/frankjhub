import { z } from '../../../../libs/z';
import { SERVICE_AUD_PREFIX_REGEX } from '../../constants/regex.constants';

export const serviceAudPrefixSchema = z
  .string()
  .trim()
  .max(100)
  .regex(SERVICE_AUD_PREFIX_REGEX)
  .default('api://');
