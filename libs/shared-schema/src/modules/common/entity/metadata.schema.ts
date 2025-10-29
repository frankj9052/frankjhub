import { z } from '../../../libs';

export const metadataSchema = z.record(z.any()).default({});
