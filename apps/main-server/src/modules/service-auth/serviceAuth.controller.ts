import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ServiceTokenService } from './serviceToken.service';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';
import { getJWKS } from './jwks/jwks.service';
import AppDataSource from '../../config/data-source';
import { Service } from './entities/Service';
import * as argon2 from 'argon2';
import { ServiceAuthService } from './serviceAuth.service';

const serviceLoginSchema = z.object({
  serviceId: z.string(),
  serviceSecret: z.string(),
});

const serviceAuthService = new ServiceAuthService();

// 颁发 JWT
export const serviceLoginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { serviceId, serviceSecret } = serviceLoginSchema.parse(req.body);

    const serviceRepo = AppDataSource.getRepository(Service);
    const service = await serviceRepo.findOne({ where: { serviceId } });

    if (
      !service ||
      !service.isActive ||
      !(await argon2.verify(service.serviceSecret, serviceSecret))
    ) {
      throw new UnauthorizedError('Invalid service credentials');
    }

    const token = await ServiceTokenService.signToken({
      serviceId,
      scopes: service.requiredScopes,
    });

    res.status(200).json({ status: 'success', data: { token } });
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
    const result = serviceAuthService.getSnapshot();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
