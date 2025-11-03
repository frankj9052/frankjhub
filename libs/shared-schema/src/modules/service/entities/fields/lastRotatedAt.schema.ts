import { z } from '../../../../libs/z';

export const serviceLastRotatedAtSchema = z.string().datetime().nullable();
