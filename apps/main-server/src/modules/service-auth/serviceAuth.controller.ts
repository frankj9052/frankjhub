import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';
import { getJWKS } from './jwks/jwks.service';
import { ServiceAuthService } from './serviceAuth.service';
import { env } from '../../config/env';
import {
  idParamsSchema,
  serviceCreateRequestSchema,
  serviceListRequestSchema,
  serviceUpdateRequestSchema,
} from '@frankjhub/shared-schema';

const serviceLoginSchema = z.object({
  serviceId: z.string(),
  serviceSecret: z.string(),
});

const serviceAuthService = new ServiceAuthService();

// 颁发 JWT
export const serviceLoginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = serviceLoginSchema.parse(req.body);

    const result = await serviceAuthService.serviceLogin(parsed);

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

export const createServiceController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = serviceCreateRequestSchema.parse(req.body);
    const createdBy = req?.currentUser?.userName ?? 'anonymous';
    const result = await serviceAuthService.createService(parsed, createdBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getServiceListController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = serviceListRequestSchema.parse(req.query);
    const result = await serviceAuthService.getServiceList(parsed);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateServiceController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = serviceUpdateRequestSchema.parse(req.body);
    const updatedBy = req?.currentUser?.userName ?? 'anonymous';
    const result = await serviceAuthService.updateService(parsed, updatedBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const softDeleteServiceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = idParamsSchema.parse(req.body);
    const deletedBy = req?.currentUser?.userName ?? 'anonymous';
    const result = await serviceAuthService.softDeleteService(parsed.id, deletedBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const restoreServiceController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = idParamsSchema.parse(req.body);
    const restoredBy = req?.currentUser?.userName ?? 'anonymous';
    const result = await serviceAuthService.restoreService(parsed.id, restoredBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const hardDeleteServiceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = idParamsSchema.parse(req.query);
    const deletedBy = req?.currentUser?.userName ?? 'anonymous';
    const result = await serviceAuthService.hardDeleteService(parsed.id, deletedBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getServiceByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = idParamsSchema.parse(req.params);
    const result = await serviceAuthService.getServiceById(parsed.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
