import { z } from '../../../../libs/z';
import { ZodEffects, ZodTypeAny } from 'zod';

/**
 * 抽交叉校验 helper（withActionFieldsConsistency）
 * - 约束：aliases 中不能包含与 name 相同（忽略大小写、去空白）的值
 * - 额外增强：别名去空白、空项过滤、重复项提示（按原样大小写检查）
 *
 * 用法示例：
 * const schema = withActionFieldsConsistency(
 *   z.object({
 *     name: actionNameSchema,
 *     aliases: actionAliasesSchema.optional(),
 *     // ...其他字段
 *   })
 * );
 */
export const withActionFieldsConsistency = <S extends ZodTypeAny>(schema: S): ZodEffects<S> =>
  schema.superRefine((val: any, ctx) => {
    const name = String(val?.name ?? '')
      .trim()
      .toLowerCase();
    const rawAliases: unknown[] = Array.isArray(val?.aliases) ? val.aliases : [];

    // 归一化：trim + 过滤空项
    const aliases = rawAliases.map(a => String(a ?? '').trim()).filter(a => a.length > 0);

    // 1) 不能与 name 相同（忽略大小写）
    if (aliases.some(a => a.toLowerCase() === name)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['aliases'],
        message: 'aliases cannot include the action name',
      });
    }

    // 2) 重复别名检查（大小写敏感地按原值提示；如需忽略大小写可改为 a.toLowerCase() 作为 key）
    const seen = new Set<string>();
    aliases.forEach((a, i) => {
      if (seen.has(a)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['aliases', i],
          message: `Duplicate alias: '${a}'`,
        });
      } else {
        seen.add(a);
      }
    });
  });
