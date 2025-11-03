import { z } from '../../../../libs/z';

export const serviceGrantedScopesSchema = z.array(z.string().min(1)).default([]);
