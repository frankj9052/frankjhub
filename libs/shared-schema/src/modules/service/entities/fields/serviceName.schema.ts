import { z } from '../../../../libs/z';

export const serviceNameSchema = z.string().trim().min(1).max(100);
