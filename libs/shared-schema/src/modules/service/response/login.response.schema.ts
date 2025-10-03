import { createSuccessResponseSchema } from '../../../factories';
import { z, zInfer } from '../../../libs/z';

export const serviceLoginResponseSchema = createSuccessResponseSchema(
  z.object({ token: z.string() })
);

export type ServiceLoginResponse = zInfer<typeof serviceLoginResponseSchema>;
