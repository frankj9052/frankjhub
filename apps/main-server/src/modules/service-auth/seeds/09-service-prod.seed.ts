import { DataSource } from 'typeorm';
import { Service } from '../entities/Service';
import { BaseSeeder } from '../../common/libs/BaseSeeder';
import { SYSTEM_SERVICES } from '../../common/constants/system-services';

export default class ServiceProdSeed extends BaseSeeder {
  private servicesToInsert: Service[] = [];

  // 决定是否执行该种子
  override async shouldRun(dataSource: DataSource): Promise<boolean> {
    this.logger.info('🔍 Checking for system services...');

    const serviceRepo = dataSource.getRepository(Service);

    for (const key of Object.keys(SYSTEM_SERVICES)) {
      const config = SYSTEM_SERVICES[key as keyof typeof SYSTEM_SERVICES];

      const exists = await serviceRepo.findOne({ where: { serviceId: config.serviceId } });
      if (exists) {
        this.logger.info(`✅ Service "${config.serviceId}" already exists. Skipping.`);
        continue;
      }

      const service = serviceRepo.create({
        ...config,
        isActive: true,
        createdBy: 'Seed',
        updatedBy: 'Seed',
      });

      this.servicesToInsert.push(service);
    }

    return this.servicesToInsert.length > 0;
  }

  async run(dataSource: DataSource): Promise<void> {
    if (this.servicesToInsert.length === 0) {
      this.logger.warn('⚠️ No services to insert. Skipping.');
      return;
    }

    const serviceRepo = dataSource.getRepository(Service);

    this.logger.info('🚀 Inserting services...');
    const savedServices = await serviceRepo.save(this.servicesToInsert);

    const serviceMap = new Map<string, Service>();
    for (const service of savedServices) {
      serviceMap.set(service.serviceId, service);
    }

    for (const service of savedServices) {
      this.logger.info(`✅ Inserted service: "${service.serviceId}"`);
    }

    this.logger.info(
      `🎉 Service seeding completed. Total inserted: ${savedServices.length} services.`
    );
  }
}
