import { baseEntitySchema } from '../../../modules/common';
import { z, zInfer } from '../../../libs/z';
import { namespaceSchema } from './namespace.schema';
import { entitySchema } from './entity.schema';
import { qualifierSchema } from '../constants/qualifier.enum';
import { FIELDS_MODE, fieldsModeSchema } from '../constants/fields-mode.enum';
import { fieldNameSchema } from './fieldName.schema';

/** ---------- 基本 DTO（与实体等价的读模型） ---------- */
export const resourceSchema = z
  .object({
    ...baseEntitySchema.shape,

    id: z.string().uuid(),

    /** namespace = serviceId（同时也是外键链接 Service.serviceId） */
    namespace: namespaceSchema,

    /** 表/聚合根（camel） */
    entity: entitySchema,

    /** qualifier：NULL | '*' | ':id' */
    qualifier: qualifierSchema.nullable().optional().default(null),

    /** 字段选择模式：all | whitelist */
    fieldsMode: fieldsModeSchema,

    /** 字段白名单（WHITELIST 使用；ALL 必须为空） */
    fields: z.array(fieldNameSchema).default([]),

    isActive: z.boolean().default(true),

    /** 扩展元数据 */
    metadata: z.record(z.unknown()).default({}),

    /** 生成列：namespace.entity[.qualifier] —— 输出端通常一并返回 */
    resourceKey: z
      .string()
      .min(3)
      .refine(v => v.includes('.'), 'resourceKey has the format namespace.entity[.qualifier]'),

    /** 乐观锁版本号 */
    version: z.number().int().nonnegative(),
  })
  /** 与数据库 Check 保持一致：fieldsMode/fields 约束 */
  .superRefine((val, ctx) => {
    const count = val.fields?.length ?? 0;
    if (val.fieldsMode === FIELDS_MODE.ALL && count !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fields'],
        message: "When fieldsMode = 'all', fields must be an empty array.",
      });
    }
    if (val.fieldsMode === FIELDS_MODE.WHITELIST && count <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fields'],
        message: "When fieldsMode = 'whitelist', fields must contain at least one field",
      });
    }
  });

export const resourceRefSchema = z.object({
  id: z.string().uuid(),
  namespace: namespaceSchema,
  entity: entitySchema,
  qualifier: qualifierSchema.nullable().optional().default(null),
  resourceKey: z.string(),
  isActive: z.boolean(),
});

export type ResourceDto = zInfer<typeof resourceSchema>;
export type ResourceRef = zInfer<typeof resourceRefSchema>;
