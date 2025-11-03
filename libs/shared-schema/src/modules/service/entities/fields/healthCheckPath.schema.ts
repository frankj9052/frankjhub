import { z } from '../../../../libs/z';

export const serviceHealthCheckPathSchema = z.string().trim().min(1).max(200).nullable();
