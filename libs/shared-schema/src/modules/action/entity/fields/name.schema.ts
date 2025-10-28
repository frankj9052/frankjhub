import { z, zInfer } from '../../../../libs/z';
import { ACTION_NAME_RE } from '../../constants/regex.constants';

export const actionNameSchema = z
  .string()
  .min(1, 'name is required')
  .max(64)
  .regex(ACTION_NAME_RE, 'name must match ^[a-z0-9_-]+$')
  .transform(s => s.trim().toLowerCase());

export type ActionName = zInfer<typeof actionNameSchema>;
