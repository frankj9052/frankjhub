import { baseEntitySchema } from '../../../modules/common';
import { z, zInfer } from '../../../libs/z';

const ACTION_NAME_RE = /^[a-z0-9_-]+$/;

const normalizeName = z
  .string()
  .min(1, 'name is required')
  .transform(s => s.trim().toLowerCase())
  .refine(s => ACTION_NAME_RE.test(s), { message: 'name must match ^[a-z0-9_-]+$' });

const normalizeDisplay = z
  .union([z.string(), z.undefined()])
  .transform(v => (typeof v === 'string' ? v.trim() : ''));

const normalizeDescription = z
  .union([z.string(), z.undefined()])
  .transform(v => (typeof v === 'string' ? v.trim() : ''));

const normalizeAliases = z.union([z.array(z.string()), z.null(), z.undefined()]).transform(arr => {
  if (!arr) return null; // 与实体的 nullable 对齐
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of arr) {
    const s = (raw ?? '').trim();
    if (s.length === 0) continue;
    if (!seen.has(s)) {
      seen.add(s);
      out.push(s);
    }
  }
  return out.length ? out : [];
});

export const actionSchema = z.object({
  ...baseEntitySchema.shape,
  id: z.string().uuid(),
  name: normalizeName,
  displayName: normalizeDisplay, // DB 默认 ''，这里解析为去空白后的字符串
  description: normalizeDescription, // DB 默认 ''，这里解析为去空白后的字符串
  aliases: normalizeAliases, // string[] | null
  isSystem: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const actionRefSchema = actionSchema.pick({
  id: true,
  name: true,
  displayName: true,
  description: true,
});

export type ActionDto = zInfer<typeof actionSchema>;
export type ActionRef = zInfer<typeof actionRefSchema>;
