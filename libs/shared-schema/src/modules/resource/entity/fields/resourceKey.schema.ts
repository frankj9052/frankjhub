import { z } from '../../../../libs/z';

export const resourceKeySchema = z.string().trim().min(3).max(300);
