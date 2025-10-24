import { z, zInfer } from '../../../libs/z';
import { FIELDS_MODE, fieldsModeSchema } from '../constants/fields-mode.enum';
import { qualifierSchema } from '../constants/qualifier.enum';
import { entitySchema } from '../entity/entity.schema';
import { fieldNameSchema } from '../entity/fieldName.schema';

export const resourceUpdateRequestSchema = z
  .object({
    id: z.string().uuid(),
    entity: entitySchema.optional(),
    qualifier: qualifierSchema.nullable().optional(),
    fieldsMode: fieldsModeSchema.optional(),
    fields: z.array(fieldNameSchema).optional(),
    isActive: z.boolean().optional(),
    metadata: z.record(z.unknown()).optional(),
  })
  .superRefine((val, ctx) => {
    // 仅当两者同时出现或可推断时做一致性检查
    if (val.fieldsMode) {
      const count = val.fields?.length ?? 0;
      if (val.fieldsMode === FIELDS_MODE.ALL && val.fields && count !== 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['fields'],
          message: "When fieldsMode = 'all', fields must be an empty array",
        });
      }
      if (val.fieldsMode === FIELDS_MODE.WHITELIST && val.fields && count <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['fields'],
          message: "When fieldsMode = 'whitelist', fields must contain at least one field",
        });
      }
    }
  });

export type ResourceUpdateRequest = zInfer<typeof resourceUpdateRequestSchema>;
