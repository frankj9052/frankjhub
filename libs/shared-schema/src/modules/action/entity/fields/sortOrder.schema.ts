import { z, zInfer } from '../../../../libs/z';

export const actionSortOrderSchema = z.number().int().min(0).default(0);
export type ActionSortOrder = zInfer<typeof actionSortOrderSchema>;
