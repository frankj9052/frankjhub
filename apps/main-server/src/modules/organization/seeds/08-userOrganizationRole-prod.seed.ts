import { DataSource } from 'typeorm';
import { BaseSeeder } from '../../common/libs/BaseSeeder';
import { User } from '../../user/entities/User';
import { Role } from '../../rbac/entities/Role';
import { Organization } from '../entities/Organization';
import { UserOrganizationRole } from '../entities/UserOrganizationRole';
import { waitForEntity } from '../../common/utils/waitForEntity';
import { SYSTEM_ORGANIZATIONS } from '../../common/constants/system-organizations';
import { env } from '../../../config/env';
import { SYSTEM_ROLES } from '../../common/constants/system-role';
import { buildRoleCode } from '../../codecs/permissionCodec';

export default class UserOrganizationRoleProdSeed extends BaseSeeder {
  private readonly email = env.SUPER_ADMIN_EMAIL;
  private shouldInsert = false;
  private user: User | null = null;
  private role: Role | null = null;
  private org: Organization | null = null;

  override async shouldRun(dataSource: DataSource): Promise<boolean> {
    this.logger.info('🔍 Checking user-org-role link...');

    const uorRepo = dataSource.getRepository(UserOrganizationRole);
    const userRepo = dataSource.getRepository(User);
    const orgRepo = dataSource.getRepository(Organization);
    const roleRepo = dataSource.getRepository(Role);

    this.user = await waitForEntity(userRepo, { email: this.email }, 'super admin user');
    this.org = await waitForEntity(
      orgRepo,
      { name: SYSTEM_ORGANIZATIONS.PLATFORM.name },
      'platform organization'
    );
    this.role = await waitForEntity(
      roleRepo,
      {
        code: buildRoleCode(
          SYSTEM_ROLES.ADMIN.roleSource,
          SYSTEM_ROLES.ADMIN.orgNameOrType,
          SYSTEM_ROLES.ADMIN.name
        ),
      },
      'admin role in platform'
    );

    if (!this.user || !this.org || !this.role) {
      this.logger.warn('⚠️ Missing required entities. Seeder will not run.');
      return false;
    }

    const exists = await uorRepo.exists({
      where: {
        user: { id: this.user.id },
        organization: { id: this.org.id },
        role: { id: this.role.id },
      },
    });

    if (exists) {
      this.logger.info('✅ Link already exists. Skipping.');
      return false;
    }

    this.shouldInsert = true;
    this.logger.warn('❌ Link missing. Will insert.');
    return true;
  }

  async run(dataSource: DataSource): Promise<void> {
    if (!this.shouldInsert || !this.user || !this.org || !this.role) {
      this.logger.warn('⚠️ Required entities not available. Run aborted.');
      return;
    }

    this.logger.info('🚀 Running UOR seeder...');

    const uorRepo = dataSource.getRepository(UserOrganizationRole);

    const uor = uorRepo.create({
      user: this.user,
      organization: this.org,
      role: this.role,
      isActive: true,
    });

    // 会触发 @BeforeInsert() 自动设置 name 字段
    await uorRepo.save(uor);

    this.logger.info('✅ Linked user to platform-admin role');
  }
}
