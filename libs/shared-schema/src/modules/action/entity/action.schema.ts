import { idSchema } from '../../../modules/common/entity/id.schema';
import { baseEntitySchema } from '../../../modules/common';
import { isActiveSchema } from '../../../modules/common/entity/isActive.schema';
import { zInfer } from 'src/libs';
import { actionNameSchema } from './fields/name.schema';
import { actionDisplayNameSchema } from './fields/displayName.schema';
import { actionDescriptionSchema } from './fields/description.schema';
import { actionAliasesSchema } from './fields/aliases.schema';
import { actionIsSystemSchema } from './fields/isSystem.schema';
import { actionSortOrderSchema } from './fields/sortOrder.schema';
import { withActionFieldsConsistency } from './validation/action.validation';

// ---- 等价实体 DTO（内部用）：严格对齐 TypeORM Entity 字段 ----
export const baseActionSchema = baseEntitySchema.extend({
  id: idSchema,
  name: actionNameSchema,
  displayName: actionDisplayNameSchema,
  description: actionDescriptionSchema.optional(),
  aliases: actionAliasesSchema,
  isSystem: actionIsSystemSchema,
  sortOrder: actionSortOrderSchema,
  isActive: isActiveSchema,
});

export const actionSchema = withActionFieldsConsistency(baseActionSchema);

/** 类型导出 */
export type ActionDto = zInfer<typeof actionSchema>;
