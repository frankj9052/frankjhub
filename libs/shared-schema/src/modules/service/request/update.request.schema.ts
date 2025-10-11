import { z, zInfer } from '../../../libs/z';
import { serviceSchema } from '../entities';
import { serviceCreateRequestSchema } from './create.request.schema';

export const serviceUpdateRequestSchema = z
  .object({
    id: serviceSchema.shape.id,
  })
  .extend(serviceCreateRequestSchema.partial().shape)
  .extend({
    serviceSecret: z
      .string()
      .nullable()
      .optional()
      .refine(
        v => {
          if (!v) {
            return true;
          } else if (v.startsWith('$argon2') || v.length >= 8) {
            return true;
          }
          return false;
        },
        {
          message: 'serviceSecret must be plaintext string of at least 8 characters.',
        }
      ),
    deletedAt: serviceSchema.shape.deletedAt.optional(),
    isActive: serviceSchema.shape.isActive.optional(),
  });

export type ServiceUpdateRequest = zInfer<typeof serviceUpdateRequestSchema>;
