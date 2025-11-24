// 它不是通用工具，而是一个DSL 构造器（领域专用语言的编码器）
import { RoleSource } from '@frankjhub/shared-schema';

/** -----------------------------
 * Scope Key <==> Parsed Form
 * 规范：<resourceKey>:<action>
 * - resourceKey: namespace.entity[.qualifier]  (已在上方实现)
 * - action     : 建议与 Action.name 对齐（小写、数字、下划线/中划线）
 * ------------------------------ */
export interface ScopeKeyParts {
  resource: ResourceKeyParts;
  action: string;
}

/** Action 名称规范：小写字母/数字/下划线/中划线，且非空 */
const ACTION_RE = /^[a-z0-9_-]+$/;

/**
 * 构建 scope key
 * @example
 * buildScopeKey({ resource: { namespace:'main', entity:'user' }, action:'read' })
 * // => 'main.user:read'
 */
export const buildScopeKey = (parts: ScopeKeyParts): string => {
  const resourceKey = buildResourceKey(parts.resource);
  const action = String(parts.action || '').trim();

  if (!ACTION_RE.test(action)) {
    throw new Error(`Invalid action for scopeKey: "${parts.action}"`);
  }
  return `${resourceKey}:${action}`;
};

/**
 * 解析 scope key 为结构化对象（并校验）
 * @example
 * parseScopeKey('main.user:read')
 * // => { resource: { namespace:'main', entity:'user' }, action:'read' }
 */
export const parseScopeKey = (scopeKey: string): ScopeKeyParts => {
  const s = (scopeKey || '').trim();

  // 拆成 "<resourceKey>:<action>"
  const idx = s.lastIndexOf(':');
  if (idx <= 0 || idx === s.length - 1) {
    throw new Error(`Invalid scopeKey format: "${scopeKey}"`);
  }

  const resourceRaw = s.slice(0, idx);
  const action = s.slice(idx + 1).trim();

  let resource = undefined;
  // 校验 resourceKey 与 action
  if (resourceRaw.trim() === '*') {
    resource = {
      namespace: '*',
      entity: '*',
    };
  } else {
    resource = parseResourceKey(resourceRaw);
  }
  if (!ACTION_RE.test(action) && action !== '*') {
    throw new Error(`Invalid action for scopeKey: "${action}"`);
  }

  return { resource, action };
};

/** 规范化（失败抛错，成功返回 canonical 字符串） */
export const normalizeScopeKey = (scopeKey: string): string =>
  buildScopeKey(parseScopeKey(scopeKey));

/**
 * 便捷重载：直接用字符串参数构建
 * @example
 * buildScopeKeyFrom('main', 'user', 'read') => 'main.user:read'
 * buildScopeKeyFrom('booking', 'appointment', 'create', ':id') => 'booking.appointment.:id:create'
 */
export const buildScopeKeyFrom = (
  namespace: string,
  entity: string,
  action: string,
  qualifier?: '*' | ':id'
): string =>
  buildScopeKey({
    resource: { namespace, entity, ...(qualifier ? { qualifier } : {}) },
    action,
  });

/** -----------------------------
 * Resource Key 生成 / 解析
 * 规范：namespace.entity[.qualifier]
 * 限定：qualifier ∈ { undefined/空, '*', ':id' }
 * ------------------------------ */
export interface ResourceKeyParts {
  namespace: string; // = serviceId
  entity: string; // 表/聚合根
  qualifier?: '*' | ':id';
}

/** 简单的 camel/标识符约束：首字母小写，字母数字 identifier regular expression */
const IDENT_RE = /^[a-z][a-zA-Z0-9]*$/;

export const buildResourceKey = (parts: ResourceKeyParts) => {
  const namespace = (parts.namespace || '').trim();
  const entity = (parts.entity || '').trim();
  const qualifier = (parts.qualifier || '').trim();

  // 允许全通配 *
  const allowStar = (v: string) => v === '*' || IDENT_RE.test(v);

  if (!allowStar(namespace)) {
    throw new Error(`Invalid namespace for resourceKey: "${parts.namespace}"`);
  }
  if (!allowStar(entity)) {
    throw new Error(`Invalid entity for resourceKey: "${parts.entity}"`);
  }
  if (qualifier && qualifier !== '*' && qualifier !== ':id') {
    throw new Error(
      `Invalid qualifier for resourceKey: "${parts.qualifier}" (allowed: "*", ":id")`
    );
  }

  // 🌟 智能压缩规则：
  // 1. 全部为 * 时，简写为 "*"
  if (namespace === '*' && entity === '*' && (!qualifier || qualifier === '*')) {
    return '*' as any;
  }

  // 2. qualifier 为 "*" 时省略它（因为 entity 已经是通配）
  if (qualifier === '*' || !qualifier) {
    return `${namespace}.${entity}` as any;
  }

  // 3. 其它情况，完整拼接
  return `${namespace}.${entity}.${qualifier}` as any;
};

export const parseResourceKey = (resourceKey: string): ResourceKeyParts => {
  const key = (resourceKey || '').trim();

  // 额外支持 "*"
  if (key === '*') {
    return { namespace: '*', entity: '*' };
  }

  // 允许：ns.entity / ns.* / ns.entity.* / ns.entity.:id / ns.*.*
  const m = key.match(
    /^([a-z][a-zA-Z0-9]*)\.([a-z][a-zA-Z0-9]*|\*)(?:\.(\*|:id))?$/ // 👈 entity 允许为 *
  );
  if (!m) throw new Error(`Invalid resourceKey format: "${resourceKey}"`);

  const [, namespace, entity, q] = m;
  const qualifier = (q as '*' | ':id' | undefined) || undefined;
  return { namespace, entity, ...(qualifier ? { qualifier } : {}) };
};

/** 校验与规范化（失败抛错，成功返回 canonical 字符串） */
export const normalizeResourceKey = (resourceKey: string): string =>
  buildResourceKey(parseResourceKey(resourceKey));

/** -----------------------------
 * Permission Name <==> Parsed Form
 * 规范：<resourceKey>:[action1,action2]@field1,field2?key=val&foo=bar
 * - actions: 必填；可为 '*' 或去重+排序后的数组
 * - fields : 可缺省；'*' 或 数组；空数组视为“未指定”，不出现在串中
 * - condition（建议统一用单数命名）会进行 URL 安全编码
 * ------------------------------ */
export interface ParsedPermission {
  resourceKey: string; // resourceKey (canonical)
  actions: string[] | '*';
  fields?: string[] | '*';
  condition?: Record<string, string>; // 单数命名，与实体字段对齐
}
/** 单动作 Permission 解析结果 */
export interface ParsedSinglePermission {
  resourceKey: string; // canonical
  action: string; // 单个
  fields?: string[] | '*';
  condition?: Record<string, string>;
}

/** 工具：去重+排序（稳定、大小写敏感维持按字典序） */
const uniqSort = (arr: string[]) =>
  Array.from(new Set(arr.map(s => s.trim()).filter(Boolean))).sort();

/** 工具：CSV 切分为数组 */
const splitCSV = (s: string) =>
  s
    ? s
        .split(',')
        .map(x => x.trim())
        .filter(Boolean)
    : [];

/** 单动作：构建权限名
 *  例：buildSingleActionPermissionName('main.user', 'read', ['name'], {orgId:'123'})
 *   => 'main.user:[read]@name?orgId=123'
 */
export const buildSingleActionPermissionName = (
  resourceKey: string,
  action: string,
  fields?: string[] | '*',
  condition?: Record<string, unknown>
): string => {
  const a = String(action || '').trim();
  if (!ACTION_RE.test(a)) {
    throw new Error(`Invalid action for permission: "${action}"`);
  }
  // 复用原多动作构造器（数组里只有 1 个 action）
  return buildPermissionName(resourceKey, [a], fields, condition);
};

/** 单动作：解析权限名（若包含多个动作或 '*' 则抛错）
 *  例：parseSingleActionPermissionName('main.user:[read]@*?orgId=123')
 */
export const parseSingleActionPermissionName = (permissionName: string): ParsedSinglePermission => {
  const parsed = parsePermissionName(permissionName); // 复用原解析
  if (parsed.actions === '*') {
    throw new Error('Single-action permission cannot use "*" actions');
  }
  if (!parsed.actions || parsed.actions.length !== 1) {
    throw new Error(`Expected exactly one action, got: ${parsed.actions?.join(',') || 'none'}`);
  }
  const [action] = parsed.actions;
  if (!ACTION_RE.test(action)) {
    throw new Error(`Invalid action for permission: "${action}"`);
  }
  return {
    resourceKey: parsed.resourceKey,
    action,
    ...(parsed.fields !== undefined && { fields: parsed.fields }),
    ...(parsed.condition && { condition: parsed.condition }),
  };
};

/**
 * 构建权限字符串(弃用)
 * @param resourceKey - 资源键（namespace.entity[.qualifier]）
 * @param actions     - 动作数组或 '*'（数组必须非空）
 * @param fields      - 可选字段数组或 '*'（空数组等价未指定）
 * @param condition   - 可选条件对象，按 key 排序并进行 URL 安全编码
 * @example
 * buildPermissionName('main.user', ['read'], ['name','email'], { orgId: '123' })
 * // => 'main.user:[read]@name,email?orgId=123'
 */
export const buildPermissionName = (
  resourceKey: string,
  actions: string[] | '*',
  fields?: string[] | '*',
  condition?: Record<string, unknown>
): string => {
  // 1) 规范化 resourceKey
  const canonicalResource = normalizeResourceKey(resourceKey);

  // 2) actions
  let actionPart: string;
  if (actions === '*') {
    actionPart = '[*]';
  } else {
    const cleaned = uniqSort(actions);
    if (cleaned.length === 0) {
      throw new Error('actions must be non-empty array or "*"');
    }
    actionPart = `[${cleaned.join(',')}]`;
  }

  // 3) fields
  const fieldPart =
    fields === undefined
      ? '' // 不出现
      : fields === '*'
      ? '@*'
      : (() => {
          const cleaned = uniqSort(fields);
          return cleaned.length > 0 ? `@${cleaned.join(',')}` : '';
        })();

  // 4) condition（URL 安全编码 + 按 key 排序）
  const conditionPart =
    condition && Object.keys(condition).length > 0
      ? '?' +
        Object.entries(condition)
          .map(([k, v]) => [k, v] as [string, unknown])
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
          .join('&')
      : '';

  return `${canonicalResource}:${actionPart}${fieldPart}${conditionPart}`;
};

/**
 * 解析权限字符串为结构化对象（并校验 resourceKey）
 * @example
 * parsePermissionName('main.user:[read,update]@name,email?orgId=123')
 */
export const parsePermissionName = (permissionName: string): ParsedPermission => {
  const name = (permissionName || '').trim();
  // 资源键使用“最宽松”的捕获，后续会 normalize 校验
  const m = name.match(/^([^:]+):\[(.*?)\](?:@([^?]+))?(?:\?(.*))?$/);
  if (!m) {
    throw new Error(`Invalid permission string format: ${permissionName}`);
  }

  const [, resourceRaw, actionStr, fieldStr, conditionStr] = m;

  // 校验 + 规范化 resourceKey
  const resourceKey = resourceRaw.trim() === '*' ? '*' : normalizeResourceKey(resourceRaw);

  // actions
  const actions: string[] | '*' = actionStr.trim() === '*' ? '*' : uniqSort(splitCSV(actionStr));

  if (actions !== '*' && actions.length === 0) {
    throw new Error('Parsed actions is an empty list');
  }

  // fields
  const fields: string[] | '*' | undefined =
    fieldStr === undefined
      ? undefined
      : fieldStr.trim() === '*'
      ? '*'
      : uniqSort(splitCSV(fieldStr));

  // condition（URL 解码）
  let condition: Record<string, string> | undefined;
  if (conditionStr) {
    const obj: Record<string, string> = {};
    conditionStr.split('&').forEach(part => {
      const eq = part.indexOf('=');
      if (eq >= 0) {
        const k = decodeURIComponent(part.slice(0, eq));
        const v = decodeURIComponent(part.slice(eq + 1));
        if (k) obj[k] = v;
      }
    });
    if (Object.keys(obj).length > 0) condition = obj;
  }

  return {
    resourceKey,
    actions,
    ...(fields !== undefined && { fields }),
    ...(condition && { condition }),
  };
};

/** -----------------------------
 * Role Code <==> Parsed Form
 * ------------------------------ */
export interface ParsedRoleCode {
  roleSource: RoleSource;
  orgNameOrType: string;
  roleName: string;
}

/**
 * 构建角色编码
 * @param roleSource - 角色来源类型，'org' 表示组织级角色，'type' 表示组织类型级角色
 * @param orgNameOrType - 组织 ID 或组织类型，例如 'org123' 或 'clinic'
 * @param roleName - 角色名称，例如 'admin'
 * @returns 构建后的角色编码，例如 'org|org123::admin' 或 'type|clinic::doctor'
 */
export const buildRoleCode = (
  roleSource: RoleSource,
  orgNameOrType: string,
  roleName: string
): string => `${roleSource}|${orgNameOrType}::${roleName.toLowerCase().trim()}`;

/**
 * 解析角色编码
 * @param roleCode - 角色编码字符串，例如 'org|org123::admin'
 * @returns 解析后的对象 { roleSource, orgIdOrType, roleName }
 */
export const parseRoleCode = (roleCode: string): ParsedRoleCode => {
  const [prefix, rest] = roleCode.split('|');
  if ((prefix !== RoleSource.ORG && prefix !== RoleSource.TYPE) || !rest) {
    throw new Error(`Invalid roleCode format (missing prefix): ${roleCode}`);
  }

  const parts = rest.split('::');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error(`Invalid roleCode format (missing orgId/type and roleName): ${roleCode}`);
  }

  return {
    roleSource: prefix as RoleSource,
    orgNameOrType: parts[0],
    roleName: parts[1],
  };
};

/** -----------------------------
 * RolePermission Name <==> Parsed
 * ------------------------------ */
export interface ParsedRolePermissionName {
  roleCode: string;
  permissionName: string;
}

/**
 * 构建角色权限关联标识
 * @param roleCode - 角色编码，例如 'org|org123::admin'
 * @param permissionName - 权限字符串
 * @returns 构建后的标识，例如 'org|org123::admin=>user:[read]'
 */
export const buildRolePermissionName = (roleCode: string, permissionName: string): string =>
  `${roleCode}=>${permissionName}`;

/**
 * 解析角色权限关联标识
 * @param name - 组合字符串，例如 'org|org123::admin=>user:[read]'
 * @returns 解析后的对象 { roleCode, permissionName }
 */
export const parseRolePermissionName = (name: string): ParsedRolePermissionName => {
  const s = (name || '').trim();
  const separatorIndex = s.indexOf('=>');

  if (separatorIndex === -1) {
    throw new Error(`Invalid rolePermission name format: ${name}`);
  }

  const roleCode = s.slice(0, separatorIndex).trim();
  const permissionName = s.slice(separatorIndex + 2).trim();

  if (!roleCode || !permissionName) {
    throw new Error(`Incomplete rolePermission name: ${name}`);
  }

  return { roleCode, permissionName };
};

/** -----------------------------
 * UserOrgRole Name <==> Parsed
 * ------------------------------ */
export interface ParsedFullUserOrgRoleName {
  userId: string;
  orgId: string;
  roleCode: string;
}

/**
 * 构建用户-组织-角色标识
 * @param userId - 用户 ID
 * @param orgId - 组织 ID
 * @param roleCode - 角色编码
 * @returns 构建后的标识字符串，例如 'user456@org123#org|org123::admin'
 */
export const buildFullUserOrgRoleName = (userId: string, orgId: string, roleCode: string): string =>
  `${userId}@${orgId}#${roleCode}`;

/**
 * 解析用户-组织-角色标识
 * @param name - 复合字符串，例如 'user456@org123#org|org123::admin'
 * @returns 结构化对象 { userId, orgId, roleCode }
 */
export const parseFullUserOrgRoleName = (name: string): ParsedFullUserOrgRoleName => {
  const s = (name || '').trim();
  const [userAndOrg, roleCode] = s.split('#');
  if (!userAndOrg || !roleCode) {
    throw new Error(`Invalid fullUserOrgRole name format: ${name}`);
  }

  const [userId, orgId] = userAndOrg.split('@');
  if (!userId || !orgId) {
    throw new Error(`Invalid user@org format in fullUserOrgRole: ${name}`);
  }

  return {
    userId: userId.trim(),
    orgId: orgId.trim(),
    roleCode: roleCode.trim(),
  };
};
