import { z } from '../../../../libs/z';

export const serviceSecretSchema = z.string().min(6).max(200);
