import { DataSource } from 'typeorm';
import { BaseSeeder } from '../../common/libs/BaseSeeder';
import { User } from '../entities/User';
import { SeederFactoryManager } from 'typeorm-extension';
import { Organization } from '../../organization/entities/Organization';
import { Role } from '../../rbac/entities/Role';
import { UserOrganizationRole } from '../../organization/entities/UserOrganizationRole';
import { SYSTEM_ORGANIZATIONS } from '../../common/constants/system-organizations';
import { buildRoleCode } from '../../codecs/permissionCodec';
import { SYSTEM_ROLES } from '../../common/constants/system-role';
import { NotFoundError } from '../../common/errors/NotFoundError';

const totalUsers = 100;
const batchSize = 10;
export default class UserSeed extends BaseSeeder {
  override async shouldRun(dataSource: DataSource): Promise<boolean> {
    this.logger.info('🔍 Checking existing user count...');
    const userRepo = dataSource.getRepository(User);
    const count = await userRepo.count();
    return count < totalUsers; // 仅在用户表为空时插入（可按需调整）
  }

  override async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    this.logger.info(`🚀 Seeding ${totalUsers} users via factory...`);
    const userFactory = factoryManager.get(User);
    const orgRepo = dataSource.getRepository(Organization);
    const roleRepo = dataSource.getRepository(Role);
    const uorRepo = dataSource.getRepository(UserOrganizationRole);

    // 怕录入数据太多，便宜db不干活，我们分开录入
    const users: User[] = [];

    for (let i = 0; i < totalUsers; i += batchSize) {
      const batch = await userFactory.saveMany(batchSize);
      users.push(...batch);
    }

    const organization = await orgRepo.findOne({
      where: { name: SYSTEM_ORGANIZATIONS.PUBLIC.name },
    }); // 你可以换成特定的组织或创建一个新的
    const role = await roleRepo.findOne({
      where: {
        code: buildRoleCode(
          SYSTEM_ROLES.CLIENT.roleSource,
          SYSTEM_ROLES.CLIENT.orgNameOrType,
          SYSTEM_ROLES.CLIENT.name
        ),
      },
    }); // 同样可以选择特定角色

    if (!organization || !role) {
      throw new NotFoundError('❌ No organization or role found to assign to users.');
    }

    for (const user of users) {
      const uor = uorRepo.create({
        user,
        organization,
        role,
        isActive: true,
      });
      await uorRepo.save(uor);
    }

    this.logger.info(`✅ ${totalUsers} users and their UserOrganizationRoles created.`);
  }
}
