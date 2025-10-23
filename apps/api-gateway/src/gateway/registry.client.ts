// 读 Redis 为主 + HTTP 回退 + 就绪标记
import {
  HttpMethod,
  RouteMatchResult,
  ServiceSnapshotResponse,
  ServiceSnapshotResponseData,
} from '@frankjhub/shared-schema';
import { redisClient, redisSubscriber } from '../infrastructure/redis';
import { createLoggerWithContext } from '../infrastructure/logger';
import axios from 'axios';
import { env } from '../config/env';
import { Channels, HttpHeaders, RedisKeys, SnapshotEvents } from '@frankjhub/shared-constants';

const log = createLoggerWithContext('RegistryClient');

let SNAPSHOT: ServiceSnapshotResponseData = { version: 0, services: [] };
let lastLoadAt = 0;
let ready = false;
const MAX_AGE_BEFORE_HTTP = Number(env.SNAPSHOT_MAX_AGE_MS ?? 60_000); // 超过1分钟才考虑HTTP

// 用于 await 网关就绪（如健康检查、启动阶段阻塞）
const readyResolvers: Array<() => void> = [];
function resolveReadyWaiters() {
  readyResolvers.splice(0).forEach(fn => fn());
}
export function waitUntilSnapshotReady(timeoutMs = 8000): Promise<void> {
  if (ready) return Promise.resolve();
  return new Promise(resolve => {
    const t = setTimeout(() => resolve(), timeoutMs); // 超时也放行，避免卡死
    readyResolvers.push(() => {
      clearTimeout(t);
      resolve();
    });
  });
}
async function loadFromRedis(): Promise<boolean> {
  try {
    // const str = await redisClient.get(SNAPSHOT_CACHE_KEY);
    const str = await redisClient.get(RedisKeys.snapshotLatest());
    if (!str) return false;
    const parsed = JSON.parse(str) as ServiceSnapshotResponse;
    if (parsed.status === 'success' && parsed.data?.services) {
      if (parsed.data.version !== SNAPSHOT.version) {
        SNAPSHOT = parsed.data;
        log.info('snapshot reloaded from redis', { v: SNAPSHOT.version });
      }
      lastLoadAt = Date.now();
      ready = true;
      return true;
    }
  } catch (error: any) {
    log.warn('redis snapshot load failed', { err: error?.message });
  }
  return false;
}

async function loadFromHttp(): Promise<boolean> {
  try {
    const { data } = await axios.get<ServiceSnapshotResponse>(env.REGISTRY_SNAPSHOT_URL, {
      headers: { [HttpHeaders.API_KEY]: env.REGISTRY_API_KEY },
      timeout: 4000,
      // 关键：不让 axios 因 4xx/5xx 抛异常
      validateStatus: () => true,
    });
    if (data.status === 'success' && data.data?.services) {
      if (data.data.version !== SNAPSHOT.version) {
        SNAPSHOT = data.data;
        log.warn('snapshot loaded from http fallback', { v: SNAPSHOT.version });
      }
      lastLoadAt = Date.now();
      ready = true;
      return true;
    }
  } catch (error: any) {
    log.error('http fallback failed', { err: error?.message });
  }
  return false;
}

/** 启动阶段：只拉一次（Redis 优先，HTTP 兜底） */
export async function bootstrapSnapshotOnce() {
  const ok = (await loadFromRedis()) || (await loadFromHttp());
  if (!ok) {
    const age = ((Date.now() - lastLoadAt) / 1000).toFixed(1);
    log.warn('snapshot refresh failed; keep in-memory', { v: SNAPSHOT.version, age });
  }
}

/** 启动后：redis拉取 */
async function refreshFromRedisWithRetries(retries = 3, delayMs = 120): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    const ok = await loadFromRedis();
    if (ok) return true;
    await new Promise(r => setTimeout(r, delayMs * (i + 1))); // 线性或指数退避
  }
  return false;
}

async function refreshOnEvent() {
  const before = SNAPSHOT.version;
  const ok = await refreshFromRedisWithRetries(3, 120);
  if (ok) return;

  // 仅当太旧时才兜底到 HTTP，避免事件风暴下的羊群效应
  const age = Date.now() - lastLoadAt;
  if (age > MAX_AGE_BEFORE_HTTP) {
    const httpOk = await loadFromHttp();
    if (!httpOk) {
      log.warn('event received; redis+http both failed; keep old snapshot', { before, age });
    }
  } else {
    log.warn('event received but redis temporarily not ready; keep old snapshot', { before });
  }
}

/** 订阅 Redis 事件：收到更新后从 Redis 取（或用内联 data） */
export async function startSnapshotEventListener() {
  // 先完成一次启动加载
  await bootstrapSnapshotOnce();

  // 订阅频道
  await redisSubscriber.subscribe(Channels.SNAPSHOT_EVENTS);
  log.info('subscribed snapshot channel', { channel: Channels.SNAPSHOT_EVENTS });

  redisClient.on('message', async (channel, message) => {
    if (channel !== Channels.SNAPSHOT_EVENTS) return;
    try {
      const evt = JSON.parse(message || '{}');

      if (evt?.type !== SnapshotEvents.SNAPSHOT_UPDATE) return;

      // 有内联 data 就直接用；否则从 Redis 读取
      if (evt?.data?.services && typeof evt?.data?.version === 'number') {
        if (evt?.data?.version !== SNAPSHOT.version) {
          SNAPSHOT = evt.data;
          lastLoadAt = Date.now();
          log.info('snapshot applied from inline event', { v: SNAPSHOT.version });
          if (!ready) {
            ready = true;
            resolveReadyWaiters();
          }
        } else {
          log.debug('inline event same version; skip', { v: evt.data.version });
        }
      } else {
        // 轻量事件 → 去 Redis 拉 -> 失败一定时间去http拉
        await refreshOnEvent();
      }
    } catch (error: any) {
      log.warn('invalid snapshot event payload', { err: error?.message, raw: message });
    }
  });

  // 断线重连场景：ioredis 会自动重连并恢复订阅；如需更强保证，可在这里监听 "ready" 再次校验一次
  redisSubscriber.on('ready', async () => {
    log.info('subscriber ready (reconnected)');
    // 保险：重连后再拉一次，防止错过某次发布
    await loadFromRedis();
  });

  // 进程信号清理在 redis 基础设施里统一处理
}

export function isSnapshotReady() {
  return ready;
}

export function getMatch(req: import('express').Request): RouteMatchResult | null {
  const path = req.path || '/';
  const method = req.method.toUpperCase() as HttpMethod;
  for (const s of SNAPSHOT.services) {
    for (const r of s.routes) {
      const allowMethod = r.methods.includes('*' as HttpMethod) || r.methods.includes(method);

      if (r.type === 'prefix') {
        if (
          allowMethod &&
          path.startsWith(`/${s.key}`) &&
          path.replace(`/${s.key}`, '').startsWith(r.pathPrefix)
        ) {
          return {
            serviceKey: s.key,
            target: s.baseUrl,
            audience: s.aud,
            requiredScopes: (s.requiredScopes || []).concat(r.requiredScopes || []),
            rewrite: r.rewrite,
          };
        }
      } else {
        if (
          allowMethod &&
          path.startsWith(`/${s.key}`) &&
          path.replace(`/${s.key}`, '').startsWith(r.path)
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
  }
  return null;
}

/** 仅测试用 */
export function getSnapshotUnsafeForDebug() {
  return SNAPSHOT;
}
