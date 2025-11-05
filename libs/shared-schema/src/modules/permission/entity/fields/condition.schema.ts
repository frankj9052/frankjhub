import { z } from '../../../../libs/z';

export const permissionConditionSchema = z.record(z.any()).nullish();
