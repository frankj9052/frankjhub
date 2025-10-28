import { z, zInfer } from '../../../../libs/z';
import { trim } from '@frankjhub/shared-utils';

export const actionDescriptionSchema = z
  .string()
  .max(255)
  .default('')
  .transform(s => trim(s) as string);

export type ActionDescription = zInfer<typeof actionDescriptionSchema>;
