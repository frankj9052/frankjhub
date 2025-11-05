import { z } from '../../../../libs/z';

export const permissionNameSchema = z.string().trim().min(1).max(512);
