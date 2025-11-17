import { DataSource } from 'typeorm';
import { BaseSeeder } from '../../common/libs/BaseSeeder';
import { RouteScope } from '../entities/RouteScope';
import { SeederFactoryManager } from 'typeorm-extension';
import { ServiceRoute } from '../../service-route/entities/ServiceRoute';
import { Scope } from '../../scope/entities/Scope';
import {
  SYSTEM_SERVICE_ROUTES,
  SystemServiceRouteKey,
} from '../../common/constants/system-serviceRoutes';

export default class routeScopeProdSeed extends BaseSeeder {
  private routeScopeToInsert: RouteScope[] = [];

  override async shouldRun(dataSource: DataSource): Promise<boolean> {
    this.logger.info('🔍 Checking for system route scopes...');

    const routeRepo = dataSource.getRepository(ServiceRoute);
    const scopeRepo = dataSource.getRepository(Scope);
    const routeScopeRepo = dataSource.getRepository(RouteScope);

    // 处理SYSTEM_SERVICE_ROUTE里的routeScope
    for (const key of Object.keys(SYSTEM_SERVICE_ROUTES)) {
      const config = SYSTEM_SERVICE_ROUTES[key as SystemServiceRouteKey];

      // 检测route是否存在
      const route = await routeRepo.findOne({
        where: {
          serviceId: config.serviceId,
          path: config.path,
          routeRuleType: config.routeRuleType,
          rewrite: config.rewrite ?? undefined,
        },
        withDeleted: true,
      });

      if (!route) {
        this.logger.info(
          `✅ Service Route with serviceID:"${config.serviceId}", path:"${config.path}" not exists. Skipping.`
        );
        continue;
      }

      // 检测scope是否存在
      const scopes = config.scopes;
      for (const key of scopes) {
        const scope = await scopeRepo.findOne({
          where: {
            key,
          },
          withDeleted: true,
        });
        if (!scope) {
          this.logger.info(`✅ Scope: "${key}" not exists. Skipping.`);
          continue;
        }

        // 检测routeScope是否存在
        const exists = await routeScopeRepo.exists({
          where: {
            routeId: route.id,
            scopeId: scope.id,
          },
          withDeleted: true,
        });
        if (exists) {
          this.logger.info(
            `✅ RouteScope with routeId "${route.id}" and scopedId "${scope.id}" already exists. Skipping.`
          );
          continue;
        }

        // 创建
        const routeScope = routeScopeRepo.create({
          createdBy: 'Seed',
          updatedBy: 'Seed',
          route,
          scope,
          scopeKey: key,
        });
        this.routeScopeToInsert.push(routeScope);
      }
    }
    return this.routeScopeToInsert.length > 0;
  }

  override async run(dataSource: DataSource, _factoryManager: SeederFactoryManager): Promise<void> {
    if (this.routeScopeToInsert.length === 0) {
      this.logger.warn('⚠️ No route scopes to insert. Skipping.');
      return;
    }

    const routeScopeRepo = dataSource.getRepository(RouteScope);
    const savedRouteScopes = await routeScopeRepo.save(this.routeScopeToInsert);

    for (const routeScope of savedRouteScopes) {
      this.logger.info(`✅ Inserted route scope: "${routeScope.id}"`);
    }
  }
}
