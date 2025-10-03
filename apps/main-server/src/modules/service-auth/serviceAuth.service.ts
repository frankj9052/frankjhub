import {
  ServiceLogin,
  ServiceLoginResponse,
  ServiceSnapshot,
  ServiceSnapshotResponse,
} from '@frankjhub/shared-schema';
import AppDataSource from '../../config/data-source';
import { Service } from './entities/Service';
import { SessionData } from 'express-session';
import { RolePermission } from '../role/entities/RolePermission';
import { Role } from '../role/entities/Role';
import { In } from 'typeorm';
import { parseRolePermissionName } from '../codecs/permissionCodec';
import * as argon2 from 'argon2';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';
import { ServiceTokenService } from './serviceToken.service';
import { env } from '../../config/env';

export class ServiceAuthService {
  private serviceRepo = AppDataSource.getRepository(Service);
  private roleRepo = AppDataSource.getRepository(Role);

  // service login
  async serviceLogin(data: ServiceLogin, session: SessionData): Promise<ServiceLoginResponse> {
    const { serviceId, serviceSecret } = data;
    const service = await this.serviceRepo.findOne({ where: { serviceId } });

    const roleCodes = session?.user?.roleCodes ?? [];
    let rolePermissions: RolePermission[] = [];
    let scopes: string[] = [];
    if (roleCodes && roleCodes.length > 0) {
      // 找到所有的role
      const roles = await this.roleRepo.find({
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

    return {
      status: 'success',
      message: 'service login successful',
      data: { token },
    };
  }

  // 发布快照（给网关用）
  async getSnapshot(): Promise<ServiceSnapshotResponse> {
    const services = await this.serviceRepo.find({ where: { isActive: true } });
    const snapshot: ServiceSnapshot = services.map(s => ({
      key: s.serviceId,
      aud: `${s.audPrefix}${s.serviceId}`, // e.g. api://booking
      baseUrl: s.baseUrl,
      requiredScopes: s.requiredScopes,
      routes: s.routes,
    }));
    return {
      status: 'success',
      message: 'Get service snapshot successful',
      data: {
        version: Date.now(),
        services: snapshot,
      },
    };
  }
}
