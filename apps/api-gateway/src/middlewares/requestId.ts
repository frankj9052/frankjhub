import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

// 在 Express 中为每个请求生成或透传一个 X-Request-Id，方便追踪请求链
export function requestId(req: Request, res: Response, next: NextFunction) {
  const incomingId = req.headers['x-request-id'];
  const requestId = Array.isArray(incomingId) ? incomingId[0] : incomingId || randomUUID();

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
}
