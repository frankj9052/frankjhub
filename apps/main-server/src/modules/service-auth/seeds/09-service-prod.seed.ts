import { DataSource } from 'typeorm';
import { Service } from '../entities/Service';
import { ServiceRole } from '../entities/ServiceRole';
import { BaseSeeder } from '../../common/libs/BaseSeeder';
import { SYSTEM_SERVICES } from '../../common/constants/system-services';
import { Role } from '../../rbac/entities/Role';
import { RoleSource } from '../../common/enums/roleSource.enum';

export default class ServiceProdSeed extends BaseSeeder {
  private servicesToInsert: Service[] = [];
  private serviceRoleConfigs: {
    serviceId: string;
    roleName: string;
    roleSource: RoleSource;
    orgNameOrType: string;
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

      const service = serviceRepo.create({
        serviceId: config.serviceId,
        serviceSecret: config.secret, // @BeforeInsert 中进行 hash
        description: config.description,
        isActive: true,
      });

      this.servicesToInsert.push(service);

      for (const role of config.roles) {
        this.serviceRoleConfigs.push({
          serviceId: config.serviceId,
          roleName: role.name,
          roleSource: role.roleSource,
          orgNameOrType: role.orgNameOrType,
        });
      }
    }

    return this.servicesToInsert.length > 0;
  }

  async run(dataSource: DataSource): Promise<void> {
    if (this.servicesToInsert.length === 0) {
      this.logger.warn('⚠️ No services to insert. Skipping.');
      return;
    }

    const serviceRepo = dataSource.getRepository(Service);
    const serviceRoleRepo = dataSource.getRepository(ServiceRole);
    const roleRepo = dataSource.getRepository(Role);

    this.logger.info('🚀 Inserting services...');
    const savedServices = await serviceRepo.save(this.servicesToInsert);

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

      let role: Role | null = null;

      // 根据 roleSource 选择正确的角色定位方式（organization.name 或 organizationType.name）
      if (config.roleSource === RoleSource.ORG) {
        role = await roleRepo.findOne({
          where: {
            name: config.roleName,
            roleSource: RoleSource.ORG,
            organization: { name: config.orgNameOrType },
          },
          relations: ['organization'],
        });
      } else if (config.roleSource === RoleSource.TYPE) {
        role = await roleRepo.findOne({
          where: {
            name: config.roleName,
            roleSource: RoleSource.TYPE,
            organizationType: { name: config.orgNameOrType },
          },
          relations: ['organizationType'],
        });
      }

      if (!role) {
        this.logger.error(
          `❌ Role "${config.roleName}" not found (source: ${config.roleSource}, orgNameOrType: "${config.orgNameOrType}"). Skipping.`
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
