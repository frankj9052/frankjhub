import { z, zInfer } from '../../../libs';

export const QUALIFIER = {
  ALL: '*',
  INSTANCE: ':id',
  NULL: null,
} as const;

export const qualifierSchema = z.union([
  z.literal('*'),
  z.literal(':id'),
  z.null(), // 真正支持 null
]);
export type Qualifier = zInfer<typeof qualifierSchema>;
