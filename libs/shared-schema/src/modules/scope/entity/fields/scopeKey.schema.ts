import { z } from '../../../../libs/z';

export const scopeKeySchema = z.string().trim().min(1).max(300);
