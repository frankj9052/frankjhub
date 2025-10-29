import type { ZodEffects, ZodTypeAny } from 'zod';
import { FIELDS_MODE, FieldsMode } from '../../constants';
import { z } from '../../../../libs/z';

/**
 * 抽交叉校验 helper（withResourceFieldsConsistency）
 *
 * - 约束1：当 fieldsMode = 'all' 时，fields 必须为空
 * - 约束2：当 fieldsMode = 'whitelist' 时，fields 必须非空
 *
 * 用法示例：
 * const schema = withResourceFieldsConsistency(
 *   z.object({
 *     fieldsMode: fieldsModeSchema,
 *     fields: fieldsArraySchema,
 *     // ...其他字段
 *   })
 * );
 */
export const withResourceFieldsConsistency = <S extends ZodTypeAny>(schema: S): ZodEffects<S> =>
  schema.superRefine((val: any, ctx) => {
    const mode = val?.fieldsMode as FieldsMode;
    const len = Array.isArray(val?.fields) ? val.fields.length : 0;

    if (mode === FIELDS_MODE.ALL && len !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fields'],
        message: "When fieldsMode='all', fields must be empty.",
      });
    }
    if (mode === FIELDS_MODE.WHITELIST && len <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fields'],
        message: "When fieldsMode='whitelist', fields must be non-empty.",
      });
    }
  });
