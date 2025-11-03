import { z } from '../../../../libs/z';
import { SERVICE_ID_REGEX } from '../../constants/regex.constants';

export const serviceIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .regex(SERVICE_ID_REGEX, 'serviceId must be lowercase, number, underscore or hyphen');
