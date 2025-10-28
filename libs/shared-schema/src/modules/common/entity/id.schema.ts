import { z, zInfer } from '../../../libs';

export const idSchema = z.string().uuid();

export type Id = zInfer<typeof idSchema>;
