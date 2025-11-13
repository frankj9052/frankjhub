import { DataSource, Repository } from 'typeorm';
import { BaseSeeder } from '../../common/libs/BaseSeeder';
import { Clinic } from '../entities/Clinic';
import { SeederFactoryManager } from 'typeorm-extension';
import { Organization } from '../../organization/entities/Organization';
import { faker } from '@faker-js/faker';
import { OrganizationType } from '../../organizationType/entities/OrganizationType';
import { SYSTEM_ORGANIZATION_TYPES } from '../../common/constants/system-organizationTypes';

const totalClinics = 8; // 按需调整
const GENERATE_EMBEDDING = 'true';

// 生成长度为dim, 每个元素随机范围在-0.1到0.1之间
function genEmbedding(dim = 1536): number[] {
  // 仅用于测试/占位：随机小数（-0.1 ~ 0.1）
  // 如需与实际模型对齐，在后续“向量同步/嵌入生成”流程中统一写入
  return Array.from({ length: dim }, () => (Math.random() - 0.5) / 5);
}

export default class ClinicSeed extends BaseSeeder {
  private clinicOrgType: OrganizationType | null = null;
  private getOrgTypeRepo(dataSource: DataSource): Repository<OrganizationType> {
    return dataSource.getRepository(OrganizationType);
  }
  private getClinicRepo(dataSource: DataSource): Repository<Clinic> {
    return dataSource.getRepository(Clinic);
  }
  override async shouldRun(dataSource: DataSource): Promise<boolean> {
    this.logger.info('🔍 Checking existing Clinic OrgType ...');
    const orgTypeRepo = this.getOrgTypeRepo(dataSource);
    this.clinicOrgType = await orgTypeRepo.findOne({
      where: { name: SYSTEM_ORGANIZATION_TYPES.CLINIC.name },
    });

    this.logger.info('🔍 Checking existing clinic count...');
    const clinicRepo = this.getClinicRepo(dataSource);
    const count = await clinicRepo.count();
    return count < totalClinics && !!this.clinicOrgType;
  }

  override async run(_dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    if (!this.clinicOrgType) return;
    this.logger.info(`🚀 Seeding ${totalClinics} clinics via factory...`);

    const clinicFactory = factoryManager.get(Clinic);
    const orgFactory = factoryManager.get(Organization);

    const created: Clinic[] = [];
    for (let i = 0; i < totalClinics; i++) {
      // 先创建 Organization
      const org = await orgFactory.save({
        orgType: this.clinicOrgType,
      });

      // 通过 override 覆盖 orgId / organization 以及关键字段，确保一致性
      const overrides: Partial<Clinic> = {
        orgId: org.id,
        organization: org,
        displayName: `${org.name} Clinic`,
        legalName: faker.datatype.boolean() ? `${org.name} Health Services Inc.` : null,
        embedding: GENERATE_EMBEDDING ? genEmbedding(1536) : null,
      };

      // 保存Clinic
      const clinic = await clinicFactory.save(overrides);
      created.push(clinic);
    }
    this.logger.info(`✅ ${created.length} clinics created.`);
    if (GENERATE_EMBEDDING) {
      this.logger.warn(
        'ℹ️ SEED_CLINIC_EMBEDDING=true → seeded clinics include mock 1536-d embeddings.'
      );
    } else {
      this.logger.info(
        'ℹ️ Embeddings left as NULL (recommended). Generate later in your embedding pipeline.'
      );
    }
  }
}
