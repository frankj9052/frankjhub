import { z, zInfer } from '../../../libs/z';
import { FIELDS_MODE, fieldsModeSchema } from '../constants/fields-mode.enum';
import { qualifierSchema } from '../constants/qualifier.enum';
import { entitySchema } from '../entity/entity.schema';
import { fieldNameSchema } from '../entity/fieldName.schema';
import { namespaceSchema } from '../entity/namespace.schema';

export const resourceCreateRequestSchema = z
  .object({
    namespace: namespaceSchema,
    entity: entitySchema,
    qualifier: qualifierSchema.nullable().optional(),
    fieldsMode: fieldsModeSchema.default(FIELDS_MODE.ALL),
    fields: z.array(fieldNameSchema).default([]),
    isActive: z.boolean().default(true),
    metadata: z.record(z.unknown()).default({}),
  })
  .superRefine((val, ctx) => {
    const count = val.fields?.length ?? 0;
    if (val.fieldsMode === FIELDS_MODE.ALL && count !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fields'],
        message: "When fieldsMode = 'all', fields must be an empty array",
      });
    }
    if (val.fieldsMode === FIELDS_MODE.WHITELIST && count <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fields'],
        message: "When fieldsMode = 'whitelist', fields must contain at least one field.",
      });
    }
  });

export type ResourceCreateRequest = zInfer<typeof resourceCreateRequestSchema>;
