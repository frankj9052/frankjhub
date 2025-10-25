import { z, zInfer } from '../../../libs';
import { entitySchema, namespaceSchema } from '../entity';
import { qualifierSchema } from '../constants';

export const resourceRefSchema = z.object({
  id: z.string().uuid(),
  namespace: namespaceSchema,
  entity: entitySchema,
  qualifier: qualifierSchema.nullable().optional().default(null),
  resourceKey: z.string(),
  isActive: z.boolean(),
});

export type ResourceRef = zInfer<typeof resourceRefSchema>;
