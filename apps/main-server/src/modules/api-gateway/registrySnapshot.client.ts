import {
  HttpMethod,
  RouteMatchResult,
  ServiceSnapshotEntry,
  ServiceSnapshotResponse,
  ServiceSnapshotResponseData,
  ServiceSnapshotRoute,
} from '@frankjhub/shared-schema';
import axios from 'axios';
import { env } from '../../config/env';

// 从控制面接口拉取快照
let SNAPSHOT: ServiceSnapshotResponseData = { version: 0, services: [] };
let snapshotFailStreak = 0;
export async function refreshSnapshot() {
  try {
    const { data } = await axios.get<ServiceSnapshotResponse>(env.REGISTRY_SNAPSHOT_URL, {
      headers: { 'x-api-key': env.REGISTRY_API_KEY || '' },
      timeout: 4000, // 稍短于调度间隔
    });
    if (data.status === 'success' && data.data.version !== SNAPSHOT.version) {
      SNAPSHOT = data.data;
    }
    snapshotFailStreak = 0;
  } catch (e) {
    snapshotFailStreak++;
    console.warn(
      '[snapshot] refresh failed x',
      snapshotFailStreak,
      (e as any)?.code || (e as any)?.message
    );
  }
}

// 返回的是网关路由匹配的结果对象，语义上它就是 一次路由匹配后的描述信息
// export function getMatch(req: import('express').Request): RouteMatchResult | null {
//   const path = req.path || '/';
//   const method = req.method.toUpperCase() as HttpMethod;
//   for (const s of SNAPSHOT.services) {
//     for (const r of s?.routes ?? []) {
//       const allowMethod = r.methods.includes('*' as HttpMethod) || r.methods.includes(method);

//       if (r.routeRuleType === 'prefix') {
//         if (
//           allowMethod &&
//           path.startsWith(`/${s.key}`) &&
//           path.replace(`/${s.key}`, '').startsWith(r.path)
//         ) {
//           return {
//             serviceKey: s.key,
//             target: s.baseUrl,
//             audience: s.aud,
//             requiredScopes: (s.requiredScopes || []).concat(r.scopeKeys || []),
//             rewrite: r.rewrite ?? undefined,
//           };
//         }
//       } else {
//         if (
//           allowMethod &&
//           path.startsWith(`/${s.key}`) &&
//           path.replace(`/${s.key}`, '').startsWith(r.path)
//         ) {
//           return {
//             serviceKey: s.key,
//             target: s.baseUrl,
//             audience: s.aud,
//             requiredScopes: (s.requiredScopes || []).concat(r.requiredScopes || []),
//             rewrite: r.rewrite,
//           };
//         }
//       }
//     }
//   }
//   return null;
// }

/** —— Helpers —— **/

/** 规范化：确保以 / 开头；去重连续斜杠；去掉尾部多余斜杠（根除外） */
function normPath(p: string): string {
  if (!p) return '/';
  // 解码并替换重复斜杠
  let s = decodeURIComponent(p).replace(/\/{2,}/g, '/');
  if (!s.startsWith('/')) s = '/' + s;
  // 去掉尾部斜杠（但保留根 /）
  if (s.length > 1 && s.endsWith('/')) s = s.slice(0, -1);
  return s;
}
/** 取去掉固定前缀后的剩余路径（不使用 replace，避免误伤） */
function sliceAfterPrefix(full: string, prefix: string): string | null {
  if (!full.startsWith(prefix)) return null;
  const rest = full.slice(prefix.length) || '/';
  return normPath(rest);
}

/** 方法匹配（支持 * 通配） */
function allowMethod(methods: HttpMethod[], m: HttpMethod): boolean {
  return methods.includes('*') || methods.includes(m);
}

/** prefix 匹配：要求边界正确（/users 不应匹配 /users123） */
function startsWithSegment(rest: string, base: string): boolean {
  const a = normPath(rest);
  const b = normPath(base);
  if (b === '/') return true; // 前缀为根时，全部命中
  if (!a.startsWith(b)) return false;
  // 边界：完全相等或后面紧跟 '/'
  return a.length === b.length || a.charAt(b.length) === '/';
}

/** 将 '/users/:id/*' 转为正则：^/users/([^/]+)(?:/.*)?$ */
function routeToRegex(path: string): RegExp {
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = normPath(path).split('/').filter(Boolean);
  const res = parts
    .map(seg => {
      if (seg === '*') return '(?:.*)'; // 贪婪尾随
      if (seg.startsWith(':')) return '([^/]+)'; // 简单参数段
      return esc(seg);
    })
    .join('/');
  return new RegExp(`^/${res}$`);
}

/** exact 匹配：支持 :param 与 * */
function matchExact(rest: string, pattern: string): boolean {
  const re = routeToRegex(pattern);
  return re.test(normPath(rest));
}

/** 合并 scopes（容错两个字段名） */
function mergeScopes(svc: ServiceSnapshotEntry, r: ServiceSnapshotRoute): string[] {
  const a = svc.requiredScopes ?? [];
  const b = r.scopeKeys ?? r.scopeKeys ?? [];
  return a.concat(b);
}

/** —— 主逻辑 —— **/
export function getMatch(req: import('express').Request): RouteMatchResult | null {
  const requestPath = normPath(req.path || '/');
  const method = (req.method?.toUpperCase() as HttpMethod) || 'GET';

  for (const s of SNAPSHOT.services) {
    // 1) 服务前缀（如将来引入 service.basePath，可在此组合）
    const servicePrefix = normPath(`/${s.key}`);
    const rest = sliceAfterPrefix(requestPath, servicePrefix);
    if (rest == null) continue; // 不属于该 service

    for (const r of s.routes ?? []) {
      if (!allowMethod(r.methods, method)) continue;

      let matched = false;
      if (r.routeRuleType === 'prefix') {
        matched = startsWithSegment(rest, r.path);
      } else {
        matched = matchExact(rest, r.path);
      }
      if (!matched) continue;

      // 若未来需要依 authMode 组合 Service 与 Route scopes 的 ANY/ALL，
      // 可在此返回 { any: [...], all: [...] } 结构，或附带 authMode 供下游判断。
      const requiredScopes = mergeScopes(s, r);

      return {
        serviceKey: s.key,
        target: s.baseUrl,
        audience: s.aud ?? null,
        requiredScopes,
        rewrite: r.rewrite ?? undefined,
      };
    }
  }

  return null;
}

// 定时器由模块对外暴露，供 main.ts 调用
// 把调度间隔拉开，避免 timeout 与间隔相同导致重叠
export function startSnapshotScheduler() {
  refreshSnapshot().catch(() => void 0);
  setInterval(() => refreshSnapshot().catch(() => void 0), 8000);
}
