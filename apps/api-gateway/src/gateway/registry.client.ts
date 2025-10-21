// 读 Redis 为主 + HTTP 回退 + 就绪标记
import {
  HttpMethod,
  RouteMatchResult,
  ServiceSnapshotResponse,
  ServiceSnapshotResponseData,
} from '@frankjhub/shared-schema';
import { redisClient } from '../infrastructure/redis';
import { createLoggerWithContext } from '../infrastructure/logger';
import axios from 'axios';
import { env } from '../config/env';
import { Request } from 'express';

const log = createLoggerWithContext('RegistryClient');

const SNAPSHOT_CACHE_KEY = 'snapshot:latest';
let SNAPSHOT: ServiceSnapshotResponseData = { version: 0, services: [] };
let lastLoadAt = 0;
let ready = false;

async function loadFormRedis(): Promise<boolean> {
  try {
    const str = await redisClient.get(SNAPSHOT_CACHE_KEY);
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
      headers: { 'x-api-key': env.REGISTRY_API_KEY },
      timeout: 4000,
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

export async function refreshSnapshotOnce() {
  const ok = (await loadFormRedis()) || (await loadFromHttp());
  if (!ok) {
    const age = ((Date.now() - lastLoadAt) / 1000).toFixed(1);
    log.warn('snapshot refresh failed; keep in-memory', { v: SNAPSHOT.version, age });
  }
}

export function startSnapshotScheduler() {
  refreshSnapshotOnce().catch(() => void 0);
  const t = setInterval(
    () => refreshSnapshotOnce().catch(() => void 0),
    env.SNAPSHOT_REFRESH_INTERVAL_MS
  );
  process.on('SIGTERM', () => clearInterval(t));
  process.on('SIGINT', () => clearInterval(t));
}

export function isSnapshotReady() {
  return ready;
}

export function getMatch(req: Request): RouteMatchResult | null {
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
