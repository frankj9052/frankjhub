import { Router } from 'express';
import { isSnapshotReady } from '../gateway/registry.client';

export function mountHealthRoutes(r: Router) {
  r.get('/healthz', (_req, res) => res.json({ status: 'ok' }));
  r.get('/readyz', (_req, res) => {
    if (!isSnapshotReady())
      return res.status(503).json({
        status: 'not_ready',
        reason: 'snapshot',
      });
    return res.json({ status: 'ready' });
  });

  // 占位：可挂 Prometheus 指标
  r.get('/metrics', (_req, res) => res.type('text/plain').send('# metrics placeholder\n'));
}
