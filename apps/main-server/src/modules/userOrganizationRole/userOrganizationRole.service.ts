import {
  OrganizationRoleRef,
  UserOrganizationRoleDto,
  UserOrganizationRoleCreateRequest,
  UserOrganizationRoleSingleResponse,
  UserOrganizationRoleUpdateRequest,
  RoleSource,
} from '@frankjhub/shared-schema';
import AppDataSource from '../../config/data-source';
import { User } from '../user/entities/User';
import { normalizeDate } from '@frankjhub/shared-utils';
import { logger } from '../common/libs/logger';
import { UserOrganizationRole } from './entities/UserOrganizationRole';
import { Role } from '../role/entities/Role';
import { Organization } from '../organization/entities/Organization';
import { BadRequestError } from '../common/errors/BadRequestError';
import { NotFoundError } from '../common/errors/NotFoundError';
import { buildFullUserOrgRoleName } from '../codecs/permissionCodec';

export class UserOrganizationRoleService {
  private userRepo = AppDataSource.getRepository(User);
  private userOrganizationRoleRepo = AppDataSource.getRepository(UserOrganizationRole);
  private roleRepo = AppDataSource.getRepository(Role);
  private organizationRepo = AppDataSource.getRepository(Organization);

  // 需要关联userOrganizationRole, organization, organizationType, role
  buildUserOrganizationRole(user: User): UserOrganizationRoleDto {
    const orgMap = new Map<string, OrganizationRoleRef>();

    if (user.userOrganizationRoles?.length) {
      for (const uor of user.userOrganizationRoles) {
        const org = uor.organization;
        if (!org) continue;

        // 组织分组：若不存在则初始化
        let bucket = orgMap.get(org.id);
        if (!bucket) {
          bucket = {
            id: org.id,
            name: org.name,
            orgTypeId: org.orgType.id,
            orgTypeName: org.orgType.name,
            description: org.description,
            roles: [],
          };
          orgMap.set(org.id, bucket);
        }

        // 累加角色到当前组织
        const role = uor.role;
        if (role) {
          bucket.roles.push({
            id: role.id,
            code: role.code,
            name: role.name,
            description: role.description,
            roleSource: role.roleSource,
            userOrganizationRole: {
              id: uor.id,
              createdAt: normalizeDate(uor.createdAt) ?? '',
              updatedAt: normalizeDate(uor.updatedAt) ?? '',
              isActive: uor.isActive,
              createdBy: uor.createdBy,
              updatedBy: uor.updatedBy,
              deletedAt: normalizeDate(uor.deletedAt),
              deletedBy: uor.deletedBy,
            },
          });
        }
      }
    }

    const organizations = Array.from(orgMap.values());
    return {
      id: user.id,
      userName: user.userName,
      email: user.email ?? null,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName ?? null,
      gender: user.gender,
      dateOfBirth: normalizeDate(user.dateOfBirth),
      honorific: user.honorific,
      avatarImage: user.avatarImage,
      organizations,
    };
  }

  async createUserOrganizationRole(
    data: UserOrganizationRoleCreateRequest,
    createdBy: string
  ): Promise<UserOrganizationRoleSingleResponse> {
    const { userId, organizationId, roleId } = data;
    const log = logger.child({
      method: 'createUserOrganizationRole',
      createdBy,
      userId,
      organizationId,
      roleId,
    });

    const [user, organization, role] = await Promise.all([
      this.userRepo.findOneOrFail({
        where: { id: userId },
        select: { id: true, userName: true },
      }),
      this.organizationRepo.findOneOrFail({
        where: { id: organizationId },
        select: { id: true },
      }),
      this.roleRepo.findOneOrFail({
        where: { id: roleId },
        select: { id: true, name: true },
      }),
    ]);

    const alreadyExists = await this.userOrganizationRoleRepo.exists({
      where: {
        user,
        organization,
        role,
      },
    });
    if (alreadyExists) {
      throw new BadRequestError('Role already exists!');
    }

    const entity = this.userOrganizationRoleRepo.create({
      user: { id: userId },
      organization,
      role,
      createdBy,
    });

    await this.userOrganizationRoleRepo.save(entity);

    const reloaded = await this.userRepo.findOneOrFail({
      where: { id: userId },
      relations: {
        userOrganizationRoles: {
          organization: {
            orgType: true,
          },
          role: true,
        },
      },
    });

    log.info(`Role ${role.name} assigned to user ${user.userName} by ${createdBy}`);
    return {
      status: 'success',
      message: 'Role assigned successfully!',
      data: this.buildUserOrganizationRole(reloaded),
    };
  }

  async updateUserOrganizationRole(
    data: UserOrganizationRoleUpdateRequest,
    updatedBy: string
  ): Promise<UserOrganizationRoleSingleResponse> {
    const { id: userId, organizations = [] } = data;
    const log = logger.child({ method: 'updateUserOrganizationRole', updatedBy, userId });

    const replaceAll = true;

    return await AppDataSource.transaction(async manager => {
      const userRepo = manager.withRepository(this.userRepo);
      const uorRepo = manager.withRepository(this.userOrganizationRoleRepo);
      const orgRepo = manager.withRepository(this.organizationRepo);
      const roleRepo = manager.withRepository(this.roleRepo);

      // 基础校验：用户存在
      const user = await userRepo.exists({ where: { id: userId } });
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // 规范化输入&去重（防止同一 org 重复 role）
      const normalized: Array<{ organizationId: string; roleId: string }> = [];
      const seen = new Set<string>();
      for (const org of organizations) {
        if (!org?.id || !Array.isArray(org.roles)) continue;
        for (const role of org.roles) {
          if (!role?.id) continue;
          const key = `${org.id}::${role.id}`;
          if (!seen.has(key)) {
            seen.add(key);
            normalized.push({ organizationId: org.id, roleId: role.id });
          }
        }
      }

      // 读取旧数据
      const existing = await uorRepo.find({
        where: { user: { id: userId } },
        relations: { organization: true, role: true },
        select: {
          id: true,
          organization: { id: true },
          role: { id: true },
        },
      });

      const oldSet = new Set(existing.map(e => `${e.organization.id}::${e.role.id}`));
      const newSet = new Set(normalized.map(x => `${x.organizationId}::${x.roleId}`));

      // 计算差异
      const toInsertTuples = normalized.filter(
        x => !oldSet.has(`${x.organizationId}::${x.roleId}`)
      );
      const toDeleteTuples = replaceAll
        ? existing.filter(e => !newSet.has(`${e.organization.id}::${e.role.id}`))
        : [];

      const roleMap = new Map();
      // orgType / org 约束
      if (toInsertTuples.length > 0) {
        const orgIds = Array.from(new Set(toInsertTuples.map(t => t.organizationId)));
        const roleIds = Array.from(new Set(toInsertTuples.map(t => t.roleId)));

        // 取organization
        const orgs = await orgRepo
          .createQueryBuilder('o')
          .leftJoinAndSelect('o.orgType', 'ot')
          .where('o.id IN (:...ids)', { ids: orgIds })
          .getMany();
        const orgMap = new Map(orgs.map(o => [o.id, o]));

        // 取 role（含 organizationType / organization）
        const roles = await roleRepo
          .createQueryBuilder('r')
          .leftJoinAndSelect('r.organizationType', 'rot')
          .leftJoinAndSelect('r.organization', 'ro')
          .where('r.id IN (:...ids)', { ids: roleIds })
          .getMany();
        const roleMap = new Map(roles.map(r => [r.id, r]));

        const errors: string[] = [];

        for (const t of toInsertTuples) {
          const org = orgMap.get(t.organizationId);
          const role = roleMap.get(t.roleId);

          if (!org) {
            errors.push(`Organization not found: ${t.organizationId}`);
            continue;
          }
          if (!role) {
            errors.push(`Role not found: ${t.roleId}`);
            continue;
          }

          const source = role.roleSource;
          if (source === RoleSource.TYPE) {
            const orgTypeId = org.orgType.id;
            const roleOrgTypeId = role.organizationType?.id;
            if (!orgTypeId || !roleOrgTypeId || orgTypeId !== roleOrgTypeId) {
              errors.push(
                `Role(${role.id}) requires organizationType match (role.organizationType=${
                  roleOrgTypeId ?? 'NULL'
                } vs org.orgType=${orgTypeId ?? 'NULL'}) on organization ${org.id}`
              );
            }
          } else if (source === RoleSource.ORG) {
            const roleOrgId = role.organization?.id;
            if (!roleOrgId || roleOrgId !== org.id) {
              errors.push(
                `Role(${
                  role.id
                }) is org-scoped and must be assigned only to its bound organization (role.organization=${
                  roleOrgId ?? 'NULL'
                } vs org=${org.id})`
              );
            }
          } else {
            // 若有其它种类，按需扩展；这里先严格报错
            errors.push(`Unsupported roleSource for role ${role.id}: ${String(source)}`);
          }
        }

        if (errors.length > 0) {
          throw new BadRequestError(`Role validation failed: ${errors.join('; ')}`);
        }
      }

      // 按差异批量删除
      if (toDeleteTuples.length > 0) {
        await uorRepo.delete(toDeleteTuples.map(e => e.id));
      }

      // 按差异批量upsert/insert
      if (toInsertTuples.length > 0) {
        await uorRepo.upsert(
          toInsertTuples.map(x => {
            const role = 123;
            return {
              user: { id: userId },
              organization: { id: x.organizationId },
              role: { id: x.roleId },
              name: buildFullUserOrgRoleName(userId, x.organizationId, x.roleId),
              updatedBy,
            };
          }),
          {
            conflictPaths: ['user', 'organization', 'role'],
            skipUpdateIfNoValuesChanged: true,
          }
        );
      }

      // 重新加载并返回
      const reloaded = await this.userRepo.findOneOrFail({
        where: { id: userId },
        relations: {
          userOrganizationRoles: {
            organization: {
              orgType: true,
            },
            role: true,
          },
        },
      });
      log.info('Roles assigned (replace=%s) by user %s', replaceAll, updatedBy);
      return {
        status: 'success',
        message: 'Roles assigned successfully!',
        data: this.buildUserOrganizationRole(reloaded),
      };
    });
  }

  async getOrganizationRolesById(id: string): Promise<UserOrganizationRoleSingleResponse> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: {
        userOrganizationRoles: {
          organization: {
            orgType: true,
          },
          role: true,
        },
      },
    });

    if (!user) throw new NotFoundError('User not found');

    return {
      status: 'success',
      message: 'Get organization roles successfully',
      data: this.buildUserOrganizationRole(user),
    };
  }
}
