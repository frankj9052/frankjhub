import { DataSource, Repository } from 'typeorm';
import { Role } from '../entities/Role';
import { SYSTEM_ROLES } from '../../common/constants/system-role';
import { Organization } from '../../organization/entities/Organization';
import { BaseSeeder } from '../../common/libs/BaseSeeder';
import { OrganizationType } from '../../organizationType/entities/OrganizationType';
import { RoleSource } from '@frankjhub/shared-schema';

/**
 * Seeder: RoleProdSeed
 *
 * Inserts system-level roles into their designated organization or organization type.
 * Ensures idempotency and verifies all required associations exist before insertion.
 */
export default class RoleProdSeed extends BaseSeeder {
  private rolesToInsert: Role[] = [];

  private getRoleRepo(dataSource: DataSource): Repository<Role> {
    return dataSource.getRepository(Role);
  }

  override async shouldRun(dataSource: DataSource): Promise<boolean> {
    this.logger.info('🔍 Checking for missing system roles...');

    const roleRepo = this.getRoleRepo(dataSource);
    const orgRepo = dataSource.getRepository(Organization);
    const orgTypeRepo = dataSource.getRepository(OrganizationType);

    for (const key of Object.keys(SYSTEM_ROLES)) {
      const systemRole = SYSTEM_ROLES[key as keyof typeof SYSTEM_ROLES];
      const { name, description, orgNameOrType } = systemRole;
      const roleSource: RoleSource = systemRole.roleSource;

      let organization: Organization | null = null;
      let organizationType: OrganizationType | null = null;

      // 查找关联的组织或组织类型
      if (roleSource === RoleSource.TYPE) {
        organizationType = await orgTypeRepo.findOne({ where: { name: orgNameOrType } });

        if (!organizationType) {
          this.logger.error(
            `❌ Missing OrganizationType "${orgNameOrType}" for role "${name}". Skipping.`
          );
          continue;
        }

        // 检查是否已存在该角色（防止重复插入）
        const exists = await roleRepo.exists({
          where: {
            name,
            roleSource,
            organizationType: { id: organizationType.id },
          },
        });

        if (exists) {
          this.logger.info(`✅ Role "${name}" already exists in "${orgNameOrType}". Skipping.`);
          continue;
        }
      } else if (roleSource === RoleSource.ORG) {
        organization = await orgRepo.findOne({ where: { name: orgNameOrType } });

        if (!organization) {
          this.logger.error(
            `❌ Missing Organization "${orgNameOrType}" for role "${name}". Skipping.`
          );
          continue;
        }

        // 检查是否已存在该角色（防止重复插入）
        const exists = await roleRepo.exists({
          where: {
            name,
            roleSource,
            organization: { id: organization.id },
          },
        });

        if (exists) {
          this.logger.info(`✅ Role "${name}" already exists in "${orgNameOrType}". Skipping.`);
          continue;
        }
      } else {
        this.logger.error(`❌ Unsupported role source: "${roleSource}". Skipping.`);
        continue;
      }

      this.logger.warn(`❌ Missing role "${name}" in "${orgNameOrType}". Will insert.`);

      // 构建 Role 数据对象（不传 null，避免类型错误）
      const roleData: Partial<Role> = {
        name,
        description,
        isActive: true,
        roleSource,
        createdBy: 'Seed',
        updatedBy: 'Seed',
      };

      if (roleSource === RoleSource.TYPE && organizationType) {
        roleData.organizationType = organizationType;
      } else if (roleSource === RoleSource.ORG && organization) {
        roleData.organization = organization;
      }

      const role = roleRepo.create(roleData);
      this.rolesToInsert.push(role);
    }

    return this.rolesToInsert.length > 0;
  }

  override async run(dataSource: DataSource): Promise<void> {
    if (this.rolesToInsert.length === 0) {
      this.logger.info('⚠️ No missing roles to insert. Skipping.');
      return;
    }

    this.logger.info('🚀 Inserting missing roles...');

    const roleRepo = this.getRoleRepo(dataSource);
    await roleRepo.save(this.rolesToInsert);

    for (const role of this.rolesToInsert) {
      const scope = role.roleSource === RoleSource.ORG ? 'ORG' : 'TYPE';
      this.logger.info(`✅ Inserted role "${role.name}" (${scope}-scoped)`);
    }

    this.logger.info(`🎉 Completed role seeding. Total inserted: ${this.rolesToInsert.length}`);
  }
}
