// /auth/service-login 颁发 JWT
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ServiceTokenService } from './serviceToken.service';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';
import { getJWKS } from './jwks/jwks.service';
import AppDataSource from '../../config/data-source';
import { Service } from './entities/Service';
import * as argon2 from 'argon2';
import { ServiceRole } from './entities/ServiceRole';
import { RolePermission } from '../rbac/entities/RolePermission';
import { In } from 'typeorm';

const serviceLoginSchema = z.object({
  serviceId: z.string(),
  serviceSecret: z.string(),
});

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

    const serviceRoleRepo = AppDataSource.getRepository(ServiceRole);
    const serviceRoles = await serviceRoleRepo.find({
      where: { service: { id: service.id } },
      relations: ['role'],
    });
    // 拿到所有 role.id
    const roleIds = serviceRoles.map(sr => sr.role.id);

    const rolePermissionRepo = AppDataSource.getRepository(RolePermission);
    const rolePermissions = await rolePermissionRepo.find({
      where: {
        role: {
          id: In(roleIds),
        },
      },
      relations: ['permission'],
    });

    const scopes = rolePermissions
      .map(rp => rp.permission.name)
      .filter((name): name is string => Boolean(name));

    const token = await ServiceTokenService.signToken({
      serviceId,
      scopes,
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
