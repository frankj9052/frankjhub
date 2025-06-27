import { DataSource, Repository } from 'typeorm';
import { OrganizationType } from '../entities/OrganizationType';
import { BaseSeeder } from '../../common/libs/BaseSeeder';
import { SYSTEM_ORGANIZATION_TYPES } from '../../common/constants/system-organizationTypes';

/**
 * Seeder: OrganizationTypeProdSeed
 *
 * Inserts essential organization types used by the platform.
 * Ensures idempotency by only inserting types that do not already exist.
 */
export default class OrganizationTypeProdSeed extends BaseSeeder {
  private getOrgTypeRepo(dataSource: DataSource): Repository<OrganizationType> {
    return dataSource.getRepository(OrganizationType);
  }

  // 所有系统预设组织类型对象
  private readonly systemTypes = Object.values(SYSTEM_ORGANIZATION_TYPES);

  private missingOrgTypes: Array<Pick<OrganizationType, 'name' | 'description'>> = [];

  override async shouldRun(dataSource: DataSource): Promise<boolean> {
    this.logger.info('🔍 Checking for required organization types...');

    const orgTypeRepo = this.getOrgTypeRepo(dataSource);
    this.missingOrgTypes = [];

    for (const type of this.systemTypes) {
      const exists = await orgTypeRepo.exists({ where: { name: type.name } });
      if (!exists) {
        this.missingOrgTypes.push({ name: type.name, description: type.description });
        this.logger.warn(`❌ Missing organization type: "${type.name}"`);
      }
    }

    if (this.missingOrgTypes.length > 0) {
      this.logger.info(
        `🚨 ${this.missingOrgTypes.length} missing organization types will be inserted.`
      );
      return true;
    }

    this.logger.info('✅ All required organization types already exist. Skipping.');
    return false;
  }

  override async run(dataSource: DataSource): Promise<void> {
    this.logger.info('🚀 Running organization type seeder...');

    const orgTypeRepo = this.getOrgTypeRepo(dataSource);

    for (const orgType of this.missingOrgTypes) {
      await orgTypeRepo.insert(orgType);
      this.logger.info(`✅ Inserted organization type: "${orgType.name}"`);
    }

    this.logger.info(`🎉 Completed. Inserted ${this.missingOrgTypes.length} organization types.`);
  }
}
