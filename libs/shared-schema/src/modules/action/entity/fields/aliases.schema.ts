import { z, zInfer } from '../../../../libs/z';

// 允许 null；数组内：去空白、去空项、去重（大小写敏感保留）
export const actionAliasesSchema = z
  .array(z.string().transform(s => (s ?? '').trim()))
  .nullable()
  .transform(arr => {
    if (!arr) return null;
    const seen = new Set<string>();
    const cleaned = arr
      .filter(a => a.length > 0)
      .filter(a => {
        if (seen.has(a)) return false;
        seen.add(a);
        return true;
      });
    return cleaned.length ? cleaned : null;
  });

export type ActionAliases = zInfer<typeof actionAliasesSchema>;
