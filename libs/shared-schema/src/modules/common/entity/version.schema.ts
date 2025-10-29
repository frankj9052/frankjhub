import { z } from '../../../libs';

export const versionSchema = z.number().int().nonnegative();
