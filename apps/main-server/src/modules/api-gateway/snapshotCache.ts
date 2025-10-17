import { ServiceSnapshotResponse } from '@frankjhub/shared-schema';
import { createLoggerWithContext } from '../common/libs/logger';
import Redis from 'ioredis';

const logger = createLoggerWithContext('SnapshotCache');

export const SNAPSHOT_CACHE_KEY = 'snapshot:latest';
export const SNAPSHOT_META_KEY = 'snapshot:meta';
export const SNAPSHOT_LOCK_KEY = 'lock:snapshot:refresh';

// 进程内兜底：就算 Redis 抖一下也不至于“失明”
let inMemorySnapshot: ServiceSnapshotResponse | null = null;

export async function getSnapshotFromCache(redis?: Redis): Promise<ServiceSnapshotResponse | null> {
  try {
    if (redis) {
      const str = await redis.get(SNAPSHOT_CACHE_KEY);
      if (str) {
        const parsed = JSON.parse(str) as ServiceSnapshotResponse;
        inMemorySnapshot = parsed; // 同步一份到内存
        return parsed;
      }
    }
  } catch (error) {
    logger.warn('read redis failed, use in-memory fallback', error);
  }
  return inMemorySnapshot;
}

export async function setSnapshotCache(
  snapshot: ServiceSnapshotResponse,
  redis?: Redis,
  ttlSeconds = 120
): Promise<void> {
  inMemorySnapshot = snapshot;
  if (!redis) return;
  try {
    await redis
      .multi()
      .set(SNAPSHOT_CACHE_KEY, JSON.stringify(snapshot), 'EX', ttlSeconds)
      .hset(SNAPSHOT_META_KEY, {
        lastVersion: String(snapshot.data.version ?? 0),
        lastUpdatedAt: new Date().toISOString(),
      })
      .exec();
  } catch (error) {
    logger.error('write redis snapshot failed', error);
  }
}

/** 简易分布式锁，避免并发刷新 */
export async function tryAcquireLock(redis: Redis, ttlMs = 10_1000): Promise<boolean> {
  try {
    const ok = await redis.set(SNAPSHOT_LOCK_KEY, String(Date.now()), 'PX', ttlMs, 'NX');
    return ok === 'OK';
  } catch {
    return false;
  }
}

export async function releaseLock(redis: Redis): Promise<void> {
  try {
    await redis.del(SNAPSHOT_LOCK_KEY);
  } catch {
    return;
  }
}
