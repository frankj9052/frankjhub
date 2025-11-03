import { z } from '../../../../libs/z';

export const serviceBaseUrlSchema = z.string().trim().url().max(255);
