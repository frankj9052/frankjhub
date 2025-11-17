import { DataSource } from 'typeorm';
import { BaseSeeder } from '../../common/libs/BaseSeeder';
import { Scope } from '../entities/Scope';
import {
  SYSTEM_SERVICE_ROUTES,
  SystemServiceRouteKey,
} from '../../common/constants/system-serviceRoutes';
import { buildResourceKey, parseScopeKey } from '@frankjhub/shared-perm';
import { Resource } from '../../resource/entities/Resource';
import { Action } from '../../action/entities/Action';
import { SeederFactoryManager } from 'typeorm-extension';

export default class ScopeProdSeed extends BaseSeeder {
  private scopeToInsert: Scope[] = [];

  override async shouldRun(dataSource: DataSource): Promise<boolean> {
    this.logger.info('🔍 Checking for system service routes...');

    const scopeRepo = dataSource.getRepository(Scope);
    const resourceRepo = dataSource.getRepository(Resource);
    const actionRepo = dataSource.getRepository(Action);

    // 处理SYSTEM_SERVICE_ROUTE里的scope
    for (const key of Object.keys(SYSTEM_SERVICE_ROUTES)) {
      const config = SYSTEM_SERVICE_ROUTES[key as SystemServiceRouteKey];

      // 检测scope是否存在
      const scopes = config.scopes;
      for (const key of scopes) {
        const exists = await scopeRepo.exists({
          where: {
            key,
          },
          withDeleted: true,
        });
        if (exists) {
          continue;
        }

        const parsedScopeKey = parseScopeKey(key);

        // 检测resource是否存在
        const resource = await resourceRepo.findOne({
          where: {
            namespace: parsedScopeKey.resource.namespace,
            entity: parsedScopeKey.resource.entity,
            qualifier: parsedScopeKey.resource.qualifier,
          },
          withDeleted: true,
        });
        if (!resource) {
          this.logger.info(
            `✅ resource "${parsedScopeKey.resource.namespace}" not exists. Skipping.`
          );
          continue;
        }

        // 检测action是否存在
        const action = await actionRepo.findOne({
          where: {
            name: parsedScopeKey.action,
          },
          withDeleted: true,
        });
        if (!action) {
          this.logger.info(`✅ action "${parsedScopeKey.action}" not exists. Skipping.`);
          continue;
        }

        const scope = scopeRepo.create({
          createdBy: 'Seed',
          updatedBy: 'Seed',
          resource,
          action,
          resource_key: buildResourceKey(parsedScopeKey.resource),
          actionName: parsedScopeKey.action,
          key,
        });

        this.scopeToInsert.push(scope);
      }
    }
    return this.scopeToInsert.length > 0;
  }

  override async run(dataSource: DataSource, _factoryManager: SeederFactoryManager): Promise<void> {
    if (this.scopeToInsert.length === 0) {
      this.logger.warn('⚠️ No scopes to insert. Skipping.');
      return;
    }

    const scopeRepo = dataSource.getRepository(Scope);
    const savedScopes = await scopeRepo.save(this.scopeToInsert);

    for (const scope of savedScopes) {
      this.logger.info(`✅ Inserted scope: "${scope.key}"`);
    }
  }
}
