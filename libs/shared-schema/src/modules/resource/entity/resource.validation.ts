import type { ZodEffects, ZodTypeAny } from 'zod';
import { FIELDS_MODE, FieldsMode } from '../constants';
import { z } from '../../../libs/z';

// 抽交叉校验 helper（withFieldsConsistency）
export const withFieldsConsistency = <S extends ZodTypeAny>(schema: S): ZodEffects<S> =>
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
