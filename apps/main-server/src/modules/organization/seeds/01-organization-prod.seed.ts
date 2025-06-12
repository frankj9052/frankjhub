import { DataSource, Repository } from 'typeorm';
import { Organization } from '../entities/Organization';
import { OrganizationCategory } from '../entities/OrganizationCategory';
import { SYSTEM_ORGANIZATIONS } from '../../common/constants/system-organizations';
import { BaseSeeder } from '../../common/libs/BaseSeeder';

/**
 * Seeder: OrganizationProdSeed
 *
 * Inserts essential organization categories and organizations used by the platform.
 * Only inserts missing ones (ensures idempotency).
 */
export default class OrganizationProdSeed extends BaseSeeder {
  private getOrgRepo(dataSource: DataSource): Repository<Organization> {
    return dataSource.getRepository(Organization);
  }

  private getCategoryRepo(dataSource: DataSource): Repository<OrganizationCategory> {
    return dataSource.getRepository(OrganizationCategory);
  }

  // 所有系统预设组织对象（包含类别信息）
  private readonly organizations = [SYSTEM_ORGANIZATIONS.PUBLIC, SYSTEM_ORGANIZATIONS.PLATFORM];

  private missingCategories: Array<Pick<OrganizationCategory, 'name' | 'description'>> = [];
  private missingOrganizations: Array<Pick<Organization, 'name' | 'description'>> = [];

  override async shouldRun(dataSource: DataSource): Promise<boolean> {
    this.logger.info('🔍 Checking for required organization categories and organizations...');

    const categoryRepo = this.getCategoryRepo(dataSource);
    const orgRepo = this.getOrgRepo(dataSource);

    this.missingCategories = [];
    this.missingOrganizations = [];

    // 1. 检查是否缺失 OrganizationCategory
    for (const org of this.organizations) {
      const { name, description } = org.category;
      const categoryExists = await categoryRepo.exists({ where: { name } });
      if (!categoryExists) {
        this.missingCategories.push({ name, description });
        this.logger.warn(`❌ Missing category: "${name}"`);
      }
    }

    // 2. 检查是否缺失 Organization
    for (const org of this.organizations) {
      const orgExists = await orgRepo.exists({ where: { name: org.name } });
      if (!orgExists) {
        this.missingOrganizations.push({ name: org.name, description: org.description });
        this.logger.warn(`❌ Missing organization: "${org.name}"`);
      }
    }

    if (this.missingCategories.length > 0 || this.missingOrganizations.length > 0) {
      this.logger.info(
        `🚨 ${this.missingCategories.length} missing categories and ${this.missingOrganizations.length} missing organizations will be inserted.`
      );
      return true;
    }

    this.logger.info('✅ All required categories and organizations already exist. Skipping.');
    return false;
  }

  async run(dataSource: DataSource): Promise<void> {
    this.logger.info('🚀 Running organization category & organization seeder...');

    const categoryRepo = this.getCategoryRepo(dataSource);
    const orgRepo = this.getOrgRepo(dataSource);

    // 1. 插入缺失的 OrganizationCategory
    for (const category of this.missingCategories) {
      await categoryRepo.insert(category);
      this.logger.info(`✅ Inserted category: "${category.name}"`);
    }

    // 2. 查找并关联 category，然后插入 Organization
    for (const org of this.organizations) {
      const category = await categoryRepo.findOneOrFail({
        where: { name: org.category.name },
      });

      const existing = await orgRepo.findOne({ where: { name: org.name } });
      if (!existing) {
        await orgRepo.insert({
          name: org.name,
          description: org.description,
          category: category, // 这里假设 Organization 中有 @ManyToOne 到 OrganizationCategory
        });
        this.logger.info(`✅ Inserted organization: "${org.name}"`);
      }
    }

    this.logger.info(
      `🎉 Completed. Inserted ${this.missingCategories.length} categories and ${this.missingOrganizations.length} organizations.`
    );
  }
}
