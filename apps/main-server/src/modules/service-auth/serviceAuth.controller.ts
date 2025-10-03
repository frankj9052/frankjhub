import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';
import { getJWKS } from './jwks/jwks.service';
import { ServiceAuthService } from './serviceAuth.service';
import { env } from '../../config/env';

const serviceLoginSchema = z.object({
  serviceId: z.string(),
  serviceSecret: z.string(),
});

const serviceAuthService = new ServiceAuthService();

// 颁发 JWT
export const serviceLoginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = serviceLoginSchema.parse(req.body);

    const session = req.session;

    const result = await serviceAuthService.serviceLogin(parsed, session);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getJwksController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jwks = await getJWKS();
    res.status(200).json(jwks);
  } catch (err) {
    next(err);
  }
};

export const getSnapshotController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.header('x-api-key');
    if (!apiKey || apiKey !== env.REGISTRY_API_KEY) {
      throw new UnauthorizedError();
    }
    const result = await serviceAuthService.getSnapshot();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
