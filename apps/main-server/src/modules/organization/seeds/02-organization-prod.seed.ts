import { DataSource, Repository } from 'typeorm';
import { Organization } from '../entities/Organization';
import { SYSTEM_ORGANIZATIONS } from '../../common/constants/system-organizations';
import { BaseSeeder } from '../../common/libs/BaseSeeder';
import { OrganizationType } from '../../organizationType/entities/OrganizationType';

/**
 * Seeder: OrganizationProdSeed
 *
 * Inserts essential organizations used by the platform.
 * Ensures idempotency by only inserting organizations that do not already exist.
 * Requires corresponding OrganizationType to already exist in DB.
 */
export default class OrganizationProdSeed extends BaseSeeder {
  private getOrgRepo(dataSource: DataSource): Repository<Organization> {
    return dataSource.getRepository(Organization);
  }

  private getOrgTypeRepo(dataSource: DataSource): Repository<OrganizationType> {
    return dataSource.getRepository(OrganizationType);
  }

  // 所有系统预设组织对象（包含类别信息）
  private readonly organizations = [SYSTEM_ORGANIZATIONS.PUBLIC, SYSTEM_ORGANIZATIONS.PLATFORM];

  private missingOrganizations: Array<Pick<Organization, 'name' | 'description'>> = [];

  override async shouldRun(dataSource: DataSource): Promise<boolean> {
    this.logger.info('🔍 Checking for required organizations...');

    const orgRepo = this.getOrgRepo(dataSource);
    this.missingOrganizations = [];

    for (const org of this.organizations) {
      const exists = await orgRepo.exists({ where: { name: org.name } });
      if (!exists) {
        this.missingOrganizations.push({ name: org.name, description: org.description });
        this.logger.warn(`❌ Missing organization: "${org.name}"`);
      }
    }

    if (this.missingOrganizations.length > 0) {
      this.logger.info(
        `🚨 ${this.missingOrganizations.length} missing organizations will be inserted.`
      );
      return true;
    }

    this.logger.info('✅ All required organizations already exist. Skipping.');
    return false;
  }

  override async run(dataSource: DataSource): Promise<void> {
    this.logger.info('🚀 Running organization seeder...');

    const orgTypeRepo = this.getOrgTypeRepo(dataSource);
    const orgRepo = this.getOrgRepo(dataSource);

    for (const org of this.organizations) {
      const orgType = await orgTypeRepo.findOne({
        where: { name: org.typeName },
      });

      if (!orgType) {
        this.logger.error(
          `❌ Missing required organization type: "${org.typeName}". Skipping organization "${org.name}".`
        );
        continue;
      }

      const exists = await orgRepo.findOne({ where: { name: org.name } });
      if (!exists) {
        await orgRepo.insert({
          name: org.name,
          description: org.description,
          orgType: orgType, // 这里假设 Organization 中有 @ManyToOne 到 OrganizationType
        });
        this.logger.info(`✅ Inserted organization: "${org.name}"`);
      }
    }

    this.logger.info(`🎉 Completed. Inserted ${this.missingOrganizations.length} organizations.`);
  }
}
