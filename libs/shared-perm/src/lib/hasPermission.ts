import { parsePermissionName } from './permissionCodec';

/** 把 canonical resource 拆成三段：ns, entity, qualifier? 更宽容，不抛错*/
function splitResourceKey(res: string): {
  ns?: string;
  entity?: string;
  qualifier?: string;
  any?: boolean;
} {
  if (res === '*') return { any: true };
  const parts = res.split('.');
  // 允许 ns.entity 或 ns.entity.qualifier
  if (parts.length < 2 || parts.length > 3) return {};
  const [ns, entity, qualifier] = parts;
  return { ns, entity, qualifier };
}

/** 资源匹配：支持整资源通配 `*` 与 qualifier 语义 */
function matchResource(scopeRes: string, requiredRes: string): boolean {
  const s = splitResourceKey(scopeRes);
  const r = splitResourceKey(requiredRes);
  if (!s || !r) return false;
  if (s.any) return true;

  // ns & entity 必须相等
  if (!s.ns || !s.entity || s.ns !== r.ns || s.entity !== r.entity) return false;

  // qualifier 规则：
  // - scope 无 qualifier → 仅匹配 required 也无 qualifier
  // - scope '*'           → 匹配 required 任意（无 / ':id'）
  // - scope ':id'         → 仅匹配 required ':id'
  if (!s.qualifier) return !r.qualifier;
  if (s.qualifier === '*') return true;
  if (s.qualifier === ':id') return r.qualifier === ':id';
  // 未来若扩展更多 qualifier，这里可继续细化
  return false;
}

/** actions 子集匹配（scope='*' 或 scopeActions ⊇ requiredActions） */
function matchActions(scopeActs: string[] | '*', requiredActs: string[] | '*'): boolean {
  if (scopeActs === '*') return true;
  if (requiredActs === '*') {
    // required 要求“任意动作” → 只有 scope='*' 才能满足
    return false;
  }
  // required 每个动作都必须包含在 scope 中
  return requiredActs.every(a => scopeActs.includes(a));
}

/** fields 子集匹配（未指定=不过滤；'*'=全放行；数组=required 必须是其子集或未指定） */
function matchFields(
  scopeFields: string[] | '*' | undefined,
  requiredFields: string[] | '*' | undefined
): boolean {
  if (scopeFields === undefined || scopeFields === '*') return true;
  // scope 指定了白名单 → required 只能是 undefined（不要求具体字段）或者子集
  if (requiredFields === undefined) return true;
  if (requiredFields === '*') return false; // required 要求任意字段，但 scope 仅白名单 → 不足以覆盖
  return requiredFields.every(f => scopeFields.includes(f));
}

/** condition 子集匹配（scope.condition ⊆ required.condition 才可授权） */
function matchCondition(
  scopeCond: Record<string, string> | undefined,
  requiredCond: Record<string, string> | undefined
): boolean {
  if (!scopeCond || Object.keys(scopeCond).length === 0) return true; // 无条件的 scope 不限制
  if (!requiredCond) return false; // scope 有条件而 required 无 → 不匹配（安全优先）
  // scope 每个条件都要在 required 中出现且值相等
  return Object.entries(scopeCond).every(([k, v]) => requiredCond[k] === v);
}

/**
 * 判断一个权限是否被 scope 授权（支持通配符、qualifier、字段白名单、条件）
 */
export function hasPermission(scopesFromJwt: string[], requiredPermission: string): boolean {
  const required = parsePermissionName(requiredPermission);

  for (const scope of scopesFromJwt) {
    try {
      const parsed = parsePermissionName(scope);

      // 1) 资源匹配（含 qualifier 语义、整资源通配 '*'）
      const resourceMatches = matchResource(parsed.resourceKey, required.resourceKey);

      // 2) 动作匹配（'*' 或 子集）
      const actionMatches = matchActions(parsed.actions, required.actions);

      // 3) 字段匹配（未指定/ '*' / 子集）
      const fieldMatches = matchFields(parsed.fields as any, required.fields as any);

      // 4) 条件匹配（scope.condition ⊆ required.condition）
      const conditionMatches = matchCondition(
        (parsed as any).condition,
        (required as any).condition
      );

      if (resourceMatches && actionMatches && fieldMatches && conditionMatches) {
        return true;
      }
    } catch {
      // 忽略非法 scope 字符串
    }
  }

  return false;
}
