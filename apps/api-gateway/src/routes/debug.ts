import { Express, Request, Response } from 'express';
import { getMatch, getSnapshotUnsafeForDebug, isSnapshotReady } from '../gateway/registry.client';
export function mountDebugRoutes(app: Express) {
  // readiness
  app.get('/__gateway/ready', (_req, res) => {
    res.status(isSnapshotReady() ? 200 : 503).json({ ready: isSnapshotReady() });
  });

  // 查看目前匹配（不发起代理）
  app.get('/__gateway/match', (req: Request, res: Response) => {
    const method = ((req.query.method as string) || 'GET').toUpperCase();
    const path = (req.query.path as string) || '/';
    // 伪造一个 Request 只用于匹配
    const fakeReq = { method, path } as any;
    const m = getMatch(fakeReq);
    res.json({ method, path, match: m || null });
  });

  // 返回当前内存快照(仅测试用)
  app.get('/__gateway/snapshot', (_req, res) => res.json(getSnapshotUnsafeForDebug()));
}
