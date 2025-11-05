import { z } from '../../../../libs/z';

export const permissionDescriptionSchema = z.string().trim().max(255).default('');
