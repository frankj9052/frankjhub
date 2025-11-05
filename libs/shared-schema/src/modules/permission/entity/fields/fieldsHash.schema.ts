import { z } from '../../../../libs/z';

export const permissionFieldsHashSchema = z.string().trim().max(256).default('');
