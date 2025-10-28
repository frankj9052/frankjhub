import { z, zInfer } from '../../../libs/z';

export const isActiveSchema = z.boolean().default(true);
export type IsActive = zInfer<typeof isActiveSchema>;
