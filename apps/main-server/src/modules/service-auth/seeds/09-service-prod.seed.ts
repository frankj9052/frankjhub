import { DataSource } from 'typeorm';
import { Service } from '../entities/Service';
import { ServiceRole } from '../entities/ServiceRole';
import { BaseSeeder } from '../../common/libs/BaseSeeder';
import { SYSTEM_SERVICES } from '../../common/constants/system-services';
import { Organization } from '../../organization/entities/Organization';
import { Role } from '../../rbac/entities/Role';

export default class ServiceProdSeed extends BaseSeeder {
  private servicesToInsert: Service[] = [];
  private serviceRoleConfigs: {
    serviceId: string;
    roleName: string;
    organizationName: string;
  }[] = [];

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

      // 构建 Service 实体（尚未保存）
      const service = serviceRepo.create({
        serviceId: config.serviceId,
        serviceSecret: config.secret, // 将通过实体内 @BeforeInsert() hash
        description: config.description,
        isActive: true,
      });

      this.servicesToInsert.push(service);

      for (const role of config.roles) {
        this.serviceRoleConfigs.push({
          serviceId: config.serviceId,
          roleName: role.name,
          organizationName: role.organizationName,
        });
      }
    }

    return this.servicesToInsert.length > 0;
  }

  // 实际执行数据插入
  async run(dataSource: DataSource): Promise<void> {
    if (this.servicesToInsert.length === 0) {
      this.logger.warn('⚠️ No services to insert. Skipping.');
      return;
    }

    const serviceRepo = dataSource.getRepository(Service);
    const serviceRoleRepo = dataSource.getRepository(ServiceRole);
    const orgRepo = dataSource.getRepository(Organization);
    const roleRepo = dataSource.getRepository(Role);

    this.logger.info('🚀 Inserting services...');
    const savedServices = await serviceRepo.save(this.servicesToInsert);

    // 构建一个 Map 来查找刚刚保存的 Service 实体
    const serviceMap = new Map<string, Service>();
    for (const service of savedServices) {
      serviceMap.set(service.serviceId, service);
    }

    const serviceRolesToInsert: ServiceRole[] = [];

    for (const config of this.serviceRoleConfigs) {
      const service = serviceMap.get(config.serviceId);
      if (!service) {
        this.logger.error(`❌ Could not find saved service "${config.serviceId}". Skipping role.`);
        continue;
      }

      const organization = await orgRepo.findOne({ where: { name: config.organizationName } });
      if (!organization) {
        this.logger.error(`❌ Organization "${config.organizationName}" not found. Skipping.`);
        continue;
      }

      const role = await roleRepo.findOne({
        where: {
          name: config.roleName,
          organization: { id: organization.id },
        },
        relations: ['organization'],
      });

      if (!role) {
        this.logger.error(
          `❌ Role "${config.roleName}" not found in org "${organization.name}". Skipping.`
        );
        continue;
      }

      const serviceRole = serviceRoleRepo.create({ service, role });
      serviceRolesToInsert.push(serviceRole);
    }

    await serviceRoleRepo.save(serviceRolesToInsert);

    for (const service of savedServices) {
      this.logger.info(`✅ Inserted service: "${service.serviceId}"`);
    }

    this.logger.info(
      `🎉 Service seeding completed. Total inserted: ${savedServices.length} services, ${serviceRolesToInsert.length} service-roles.`
    );
  }
}
