import { baseEntitySchema } from 'src/modules/common';
import { z, zInfer } from '../../../libs/z';

export const clinicSchema = z.object({
  ...baseEntitySchema.shape,
  orgId: z.string().uuid(),
});

export type ClinicDto = zInfer<typeof clinicSchema>;
