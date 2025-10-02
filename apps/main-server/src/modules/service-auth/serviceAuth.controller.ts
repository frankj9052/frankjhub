import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ServiceTokenService } from './serviceToken.service';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';
import { getJWKS } from './jwks/jwks.service';
import AppDataSource from '../../config/data-source';
import { Service } from './entities/Service';
import * as argon2 from 'argon2';
import { ServiceAuthService } from './serviceAuth.service';
import { env } from '../../config/env';
import { Role } from '../role/entities/Role';
import { In } from 'typeorm';
import { RolePermission } from '../role/entities/RolePermission';
import { parseRolePermissionName } from '../codecs/permissionCodec';

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

    const roleCodes = req?.session?.user?.roleCodes ?? [];
    let rolePermissions: RolePermission[] = [];
    let scopes: string[] = [];
    if (roleCodes && roleCodes.length > 0) {
      // 找到所有的role
      const roleRepo = AppDataSource.getRepository(Role);
      const roles = await roleRepo.find({
        where: { code: In(roleCodes), isActive: true },
        relations: {
          rolePermissions: true,
        },
      });
      rolePermissions = roles.flatMap(role => role.rolePermissions);
    }

    scopes = rolePermissions.map(rp => parseRolePermissionName(rp.name).permissionName);

    if (
      !service ||
      !service.isActive ||
      !(await argon2.verify(service.serviceSecret, serviceSecret))
    ) {
      throw new UnauthorizedError('Invalid service credentials');
    }

    const token = await ServiceTokenService.signToken({
      serviceId,
      scopes,
      iss: env.JWT_ISSUER,
      sub: service.serviceId,
      aud: service.audPrefix + service.serviceId,
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
