import { baseEntitySchema } from '../../../modules/common';
import { z, zInfer } from '../../../libs/z';
import { namespaceSchema } from './namespace.schema';
import { entitySchema } from './entity.schema';
import { qualifierSchema } from '../constants/qualifier.enum';
import { FIELDS_MODE, fieldsModeSchema } from '../constants/fields-mode.enum';
import { fieldNameSchema } from './fieldName.schema';
import { withFieldsConsistency } from './resource.validation';

/**
 * 等价实体 DTO 的“基础对象 schema”
 * - 仅做字段类型/默认值/基本格式约束，不包含跨字段规则（便于 extend/pick）
 * - 与 DB 实体字段保持一一对应（字段名使用 API/DTO 层的 camelCase：resourceKey）
 */
export const baseResourceSchema = z.object({
  // 继承公共实体字段（通常包含 id/createdAt/updatedAt/deletedAt/isDeleted 等）
  ...baseEntitySchema.shape,

  /** 主键（UUID） */
  id: z.string().uuid(),

  /** namespace = serviceId（外键值，指向 Service.serviceId） */
  namespace: namespaceSchema,

  /** 实体名（camel，聚合根/表标识） */
  entity: entitySchema,

  /**
   * qualifier：集合/实例通配 —— NULL | '*' | ':id'
   * 为与业务表达统一，DTO 使用 null 表示未指定
   */
  qualifier: qualifierSchema.nullable().optional().default(null),

  /** 字段选择模式：'all' | 'whitelist' */
  fieldsMode: fieldsModeSchema.default(FIELDS_MODE.ALL),

  /**
   * 字段白名单（WHITELIST 模式使用；ALL 模式必须为空数组）
   * - 使用 camel 命名
   */
  fields: z.array(fieldNameSchema).default([]),

  /** 启用状态 */
  isActive: z.boolean().default(true),

  /** 扩展元数据：键值任意，交由上层约束 */
  metadata: z.record(z.unknown()).default({}),

  /**
   * 生成列（只读输出）：namespace.entity[.qualifier]
   * - DB 列名为 resource_key（snake），DTO 采用 camel：resourceKey
   */
  resourceKey: z
    .string()
    .min(3)
    .refine(v => v.includes('.'), 'resourceKey must be "namespace.entity[.qualifier]"'),

  /** 乐观锁版本号 */
  version: z.number().int().nonnegative(),
});

export const resourceSchema = withFieldsConsistency(baseResourceSchema);

/** 类型导出 */
export type ResourceDto = zInfer<typeof resourceSchema>;
export type BaseResourceDto = zInfer<typeof baseResourceSchema>;
