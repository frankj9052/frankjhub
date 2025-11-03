import { z } from '../../../../libs/z';

export const serviceOwnerTeamSchema = z.string().trim().min(1).max(200).nullable();
