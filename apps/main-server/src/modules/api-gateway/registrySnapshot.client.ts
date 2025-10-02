import {
  HttpMethod,
  RouteMatchResult,
  ServiceSnapshotResponse,
  ServiceSnapshotResponseData,
} from '@frankjhub/shared-schema';
import axios from 'axios';
import { env } from '../../config/env';

// 从控制面接口拉取快照
let SNAPSHOT: ServiceSnapshotResponseData = { version: 0, services: [] };

export async function refreshSnapshot() {
  const { data } = await axios.get<ServiceSnapshotResponse>(env.REGISTRY_SNAPSHOT_URL, {
    headers: { 'x-api-key': env.REGISTRY_API_KEY || '' },
    timeout: 5000,
  });
  if (data.status === 'success' && data.data.version !== SNAPSHOT.version) {
    SNAPSHOT = data.data;
  }
}

// 返回的是网关路由匹配的结果对象，语义上它就是 一次路由匹配后的描述信息
export function getMatch(req: import('express').Request): RouteMatchResult | null {
  const path = req.path || '/';
  const method = req.method.toUpperCase() as HttpMethod;
  for (const s of SNAPSHOT.services) {
    for (const r of s.routes) {
      if (
        path.startsWith(`/${s.key}`) &&
        path.replace(`/${s.key}`, '').startsWith(r.path) &&
        r.methods.includes(method)
      ) {
        return {
          serviceKey: s.key,
          target: s.baseUrl,
          audience: s.aud,
          requiredScopes: (s.requiredScopes || []).concat(r.requiredScopes || []),
          rewrite: r.rewrite,
        };
      }
    }
  }
  return null;
}

// 定时器由模块对外暴露，供 main.ts 调用
export function startSnapshotScheduler() {
  refreshSnapshot().catch(() => void 0);
  setInterval(() => refreshSnapshot().catch(() => void 0), 5000);
}
