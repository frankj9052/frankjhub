import { NextFunction, Request, RequestHandler, Response } from 'express';

export const emailWebhookController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('test');
};
