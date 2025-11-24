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

    // 本轮内存去重
    const seenKeys = new Set<string>();

    // 处理SYSTEM_SERVICE_ROUTE里的scope
    for (const routeKey of Object.keys(SYSTEM_SERVICE_ROUTES)) {
      const config = SYSTEM_SERVICE_ROUTES[routeKey as SystemServiceRouteKey];

      const scopes = config.scopes;

      // 检测scope是否存在
      for (const scopeKey of scopes) {
        // 先看内存里是否有重复的key
        if (seenKeys.has(scopeKey)) {
          continue;
        }

        const exists = await scopeRepo.exists({
          where: {
            key: scopeKey,
          },
          withDeleted: true,
        });
        if (exists) {
          continue;
        }

        const parsedScopeKey = parseScopeKey(scopeKey);

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
          key: scopeKey,
        });

        this.scopeToInsert.push(scope);
        seenKeys.add(scopeKey);
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
