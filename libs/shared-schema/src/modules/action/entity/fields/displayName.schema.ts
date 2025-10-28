import { z, zInfer } from '../../../../libs/z';
import { trim } from '@frankjhub/shared-utils';

export const actionDisplayNameSchema = z
  .string()
  .max(128)
  .default('')
  .transform(s => trim(s) as string);

export type ActionDisplayName = zInfer<typeof actionDisplayNameSchema>;
