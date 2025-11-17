import { SeederFactoryManager } from 'typeorm-extension';
import {
  SYSTEM_SERVICE_ROUTES,
  SystemServiceRouteKey,
} from '../../common/constants/system-serviceRoutes';
import { BaseSeeder } from '../../common/libs/BaseSeeder';
import { Service } from '../../service-auth/entities/Service';
import { ServiceRoute } from '../entities/ServiceRoute';
import { DataSource } from 'typeorm';

export default class ServiceRouteProdSeed extends BaseSeeder {
  private serviceRouteToInsert: ServiceRoute[] = [];

  override async shouldRun(dataSource: DataSource): Promise<boolean> {
    this.logger.info('🔍 Checking for system service routes...');

    const serviceRepo = dataSource.getRepository(Service);
    const serviceRouteRepo = dataSource.getRepository(ServiceRoute);
    // 处理SYSTEM_SERVICE_ROUTE
    for (const key of Object.keys(SYSTEM_SERVICE_ROUTES)) {
      const config = SYSTEM_SERVICE_ROUTES[key as SystemServiceRouteKey];

      // 检测serviceId是否存在
      const service = await serviceRepo.findOneBy({ serviceId: config.serviceId });
      if (!service) {
        this.logger.info(`✅ ServiceId "${config.serviceId}" not exists. Skipping.`);
        continue;
      }

      // 检测service route是否存在
      const exists = await serviceRouteRepo.findOne({
        where: {
          serviceId: config.serviceId,
          path: config.path,
          routeRuleType: config.routeRuleType,
          rewrite: config.rewrite ?? undefined,
        },
        withDeleted: true,
      });

      if (exists) {
        this.logger.info(
          `✅ Service Route with serviceID:"${config.serviceId}", path:"${config.path}" already exists. Skipping.`
        );
        continue;
      }

      const serviceRoute = serviceRouteRepo.create({
        ...config,
        createdBy: 'Seed',
        updatedBy: 'Seed',
        service,
        scopes: [],
      });

      this.serviceRouteToInsert.push(serviceRoute);
    }
    return this.serviceRouteToInsert.length > 0;
  }

  override async run(dataSource: DataSource, _factoryManager: SeederFactoryManager): Promise<void> {
    if (this.serviceRouteToInsert.length === 0) {
      this.logger.warn('⚠️ No service routes to insert. Skipping.');
      return;
    }

    const serviceRouteRepo = dataSource.getRepository(ServiceRoute);
    const savedServiceRoutes = await serviceRouteRepo.save(this.serviceRouteToInsert);

    for (const serviceRoute of savedServiceRoutes) {
      this.logger.info(`✅ Inserted service route: "${serviceRoute.path}"`);
    }
  }
}
