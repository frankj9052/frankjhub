import { z } from '../../../../libs/z';

export const serviceSecretVersionSchema = z.number().int().min(1).default(1);
