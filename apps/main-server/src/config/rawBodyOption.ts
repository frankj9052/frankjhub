import { Request, Response } from 'express';

export const rawBodyOption = (req: Request, _res: Response, buf: Buffer) => {
  if (buf?.length) {
    req.rawBody = buf.toString('utf8');
  }
};
