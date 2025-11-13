import { DataSource } from 'typeorm';
import { BaseSeeder } from '../../common/libs/BaseSeeder';
import { Resource } from '../entities/Resource';
import { SYSTEM_RESOURCES, SystemResourceKey } from '../../common/constants/system-resources';
import { buildResourceKey, ResourceKeyParts } from '@frankjhub/shared-perm';
import { Service } from '../../service-auth/entities/Service';

export default class ResourceProdSeed extends BaseSeeder {
  private resourcesToInsert: Resource[] = [];

  override async shouldRun(dataSource: DataSource): Promise<boolean> {
    this.logger.info('🔍 Checking for system resources...');

    const resourceRepo = dataSource.getRepository(Resource);
    const serviceRepo = dataSource.getRepository(Service);

    for (const key of Object.keys(SYSTEM_RESOURCES)) {
      const config = SYSTEM_RESOURCES[key as SystemResourceKey];

      // 检测serviceId是否存在
      const service = await serviceRepo.findOneBy({ serviceId: config.namespace });
      if (!service) {
        this.logger.info(`✅ ServiceId "${config.namespace}" not exists. Skipping.`);
        continue;
      }

      // 检测resource是否存在
      const resourceKeyParts: ResourceKeyParts = {
        namespace: config.namespace,
        entity: config.entity,
        qualifier: config.qualifier ?? undefined,
      };
      const resource_key = buildResourceKey(resourceKeyParts);

      const exists = await resourceRepo.findOne({
        where: { resource_key },
        withDeleted: true,
      });

      if (exists) {
        this.logger.info(`✅ Resource "${resource_key}" already exists. Skipping.`);
        continue;
      }

      const resource = resourceRepo.create({
        ...config,
        createdBy: 'Seed',
        updatedBy: 'Seed',
        service,
      });

      this.resourcesToInsert.push(resource);
    }

    return this.resourcesToInsert.length > 0;
  }

  async run(dataSource: DataSource): Promise<void> {
    if (this.resourcesToInsert.length === 0) {
      this.logger.warn('⚠️ No resources to insert. Skipping.');
      return;
    }

    const resourceRepo = dataSource.getRepository(Resource);

    this.logger.info('🚀 Inserting resources...');
    const savedResources = await resourceRepo.save(this.resourcesToInsert);

    for (const resource of savedResources) {
      this.logger.info(`✅ Inserted resources: "${resource.resource_key}"`);
    }
  }
}
