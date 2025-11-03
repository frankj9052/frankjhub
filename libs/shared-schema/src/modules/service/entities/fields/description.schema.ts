import { z } from '../../../../libs/z';

export const serviceDescriptionSchema = z.string().max(2000).nullable();
