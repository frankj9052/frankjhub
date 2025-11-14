import { BaseSeeder } from '../../common/libs/BaseSeeder';
import { ServiceRoute } from '../entities/ServiceRoute';
import { DataSource } from 'typeorm';
import { SeederFactoryManager } from 'typeorm-extension';

export default class ServiceRouteProdSeed extends BaseSeeder {
  private serviceRouteToInsert: ServiceRoute[] = [];

  override async shouldRun(dataSource: DataSource): Promise<boolean> {
    this.logger.info('🔍 Checking for system service routes...');
    // test
    return false;
  }

  override async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    console.log('run');
  }
}
