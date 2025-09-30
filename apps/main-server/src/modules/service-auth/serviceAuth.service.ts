import { ServiceSnapshot, ServiceSnapshotResponse } from '@frankjhub/shared-schema';
import AppDataSource from '../../config/data-source';
import { Service } from './entities/Service';

export class ServiceAuthService {
  private serviceRepo = AppDataSource.getRepository(Service);

  // 发布快照（给网关用）
  async getSnapshot(): Promise<ServiceSnapshotResponse> {
    const services = await this.serviceRepo.find({ where: { isActive: true } });
    const snapshot: ServiceSnapshot = services.map(s => ({
      key: s.serviceId,
      aud: `${s.audPrefix}${s.serviceId}`, // e.g. api://booking
      baseUrl: s.baseUrl,
      requiredScopes: s.requiredScopes,
      routes: s.routes,
    }));
    return {
      status: 'success',
      message: 'Get service snapshot successful',
      data: {
        version: Date.now(),
        services: snapshot,
      },
    };
  }
}
