import { DataSource, Repository } from 'typeorm';
import { Action } from '../entities/Action';
import { SYSTEM_ACTIONS } from '../../common/constants/system-actions';
import { BaseSeeder } from '../../common/libs/BaseSeeder';

/**
 * Seeder: ActionProdSeed
 *
 * Inserts essential actions (CRUD + all) used for permission control.
 * Only inserts missing ones (ensures idempotency).
 */
export default class ActionProdSeed extends BaseSeeder {
  private getRepository(dataSource: DataSource): Repository<Action> {
    return dataSource.getRepository(Action);
  }

  private readonly actions = SYSTEM_ACTIONS;

  private missingActions: Array<Pick<Action, 'name' | 'description'>> = [];

  override async shouldRun(dataSource: DataSource): Promise<boolean> {
    this.logger.info('🔍 Checking for required actions...');
    const repo = this.getRepository(dataSource);
    this.missingActions = [];
    const actionKeys: (keyof typeof SYSTEM_ACTIONS)[] = Object.keys(this.actions);
    for (const key of actionKeys) {
      const exists = await repo.exists({ where: { name: this.actions[key].name } });
      if (!exists) {
        this.missingActions.push(this.actions[key]);
        this.logger.warn(`❌ Missing action: "${this.actions[key].name}"`);
      }
    }

    if (this.missingActions.length > 0) {
      this.logger.info(`🚨 ${this.missingActions.length} actions will be inserted.`);
      return true;
    }

    this.logger.info('✅ All actions already exist. Skipping.');
    return false;
  }

  async run(dataSource: DataSource): Promise<void> {
    this.logger.info('🚀 Running action seeder...');
    const repo = this.getRepository(dataSource);

    for (const action of this.missingActions) {
      await repo.insert(action);
      this.logger.info(`✅ Inserted action: "${action.name}"`);
    }

    this.logger.info(`🎉 Action seeding completed. Total inserted: ${this.missingActions.length}`);
  }
}
