import { z } from '../../../../libs/z';

export const permissionFieldsSchema = z.array(z.string().trim().min(1)).default([]);
