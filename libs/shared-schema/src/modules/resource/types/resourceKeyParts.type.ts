import { Qualifier } from '../constants/qualifier.enum';

/** ---------- 工具：拼接 canonical key ---------- */
export interface ResourceKeyParts {
  namespace: string; // = serviceId
  entity: string; // 表/聚合根
  qualifier?: Qualifier;
}
