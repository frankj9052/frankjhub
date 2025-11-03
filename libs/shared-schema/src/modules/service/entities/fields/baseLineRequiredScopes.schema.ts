import { z } from '../../../../libs/z';

export const serviceBaselineRequiredScopesSchema = z.array(z.string().min(1)).default([]);
