import { z } from '../../../../libs/z';

export const permissionConditionHashSchema = z.string().trim().max(1024).default('');
