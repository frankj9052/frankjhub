import { DataSource } from 'typeorm';
import { BaseSeeder } from '../../common/libs/BaseSeeder';
import { Permission } from '../entities/Permission';
import { Resource } from '../../resource/entities/Resource';
import { Action } from '../../action/entities/Action';
import { SYSTEM_PERMISSIONS, SystemPermissionKey } from '../../common/constants/system-permissions';
import { buildSingleActionPermissionName } from '@frankjhub/shared-perm';

export default class PermissionProdSeed extends BaseSeeder {
  private permissionsToInsert: Permission[] = [];

  override async shouldRun(dataSource: DataSource): Promise<boolean> {
    this.logger.info('🔍 Checking for system permission...');

    const permissionRepo = dataSource.getRepository(Permission);
    const resourceRepo = dataSource.getRepository(Resource);
    const actionRepo = dataSource.getRepository(Action);

    for (const key of Object.keys(SYSTEM_PERMISSIONS)) {
      const config = SYSTEM_PERMISSIONS[key as SystemPermissionKey];

      // 检测resource是否存在
      const resource = await resourceRepo.findOneBy({ resource_key: config.resource_key });
      if (!resource) {
        this.logger.info(`✅ Resource key "${config.resource_key}" not exists. Skipping.`);
        continue;
      }

      // 检测action 是否存在
      const action = await actionRepo.findOneBy({ name: config.actionName });
      if (!action) {
        this.logger.info(`✅ Action key "${config.actionName}" not exists. Skipping.`);
        continue;
      }

      // 检测permission 是否存在
      const permissionName = buildSingleActionPermissionName(
        config.resource_key,
        config.actionName,
        config.fields,
        config.condition ?? undefined
      );
      const exists = await permissionRepo.exists({
        where: { name: permissionName },
        withDeleted: true,
      });
      if (exists) {
        this.logger.info(`✅ Permission "${permissionName}" already exists. Skipping.`);
        continue;
      }

      // add insert
      const permission = permissionRepo.create({
        ...config,
        createdBy: 'Seed',
        updatedBy: 'Seed',
        condition: config.condition ?? undefined,
        resource,
        action,
      });

      this.permissionsToInsert.push(permission);
    }
    return this.permissionsToInsert.length > 0;
  }

  async run(dataSource: DataSource): Promise<void> {
    if (this.permissionsToInsert.length === 0) {
      this.logger.warn('⚠️ No permissions to insert. Skipping.');
      return;
    }

    const permissionRepo = dataSource.getRepository(Permission);

    this.logger.info('🚀 Inserting permissions...');
    const savedPermissions = await permissionRepo.save(this.permissionsToInsert);

    for (const permission of savedPermissions) {
      this.logger.info(`✅ Inserted resources: "${permission.name}"`);
    }
  }
}
