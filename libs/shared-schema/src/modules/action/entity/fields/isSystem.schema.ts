import { z, zInfer } from '../../../../libs/z';

export const actionIsSystemSchema = z.boolean().default(false);
export type ActionIsSystem = zInfer<typeof actionIsSystemSchema>;
