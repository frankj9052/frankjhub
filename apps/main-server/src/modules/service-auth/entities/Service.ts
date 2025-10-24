import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as argon2 from 'argon2';
import { BaseEntity } from '../../common/entities/BaseEntity';
import { Resource } from '../../resource/entities/Resource';
import { ServiceRoute } from '../../service-route/entities/ServiceRoute';

@Entity()
@Index('ux_service_service_id_not_deleted', ['serviceId'], {
  unique: true,
  where: `"deleted_at" IS NULL`,
})
export class Service extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** 自然键：如 'booking'、'shift'*/
  @Column({ type: 'varchar', length: 100, unique: true })
  serviceId!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  /** 上游基础地址，例如 http://booking:4001 */
  @Column({ type: 'varchar' })
  baseUrl!: string;

  /** audience 前缀，最终 audience = `${audPrefix}${serviceId}` */
  @Column({ type: 'varchar', default: 'api://' })
  audPrefix?: string;

  /**
   * 服务级“最低要求”Scopes（可选）：
   * - 网关侧会将它与路由级 requiredScopes 合并，形成最终校验集
   */
  @Column({ type: 'text', array: true, default: () => `'{}'` })
  baselineRequiredScopes?: string[];

  /**
   * 颁发给“调用方服务”的允许 scopes（服务间调用白名单）
   * - 例如：service-to-service 的 Client Credentials 策略
   */
  @Column({ type: 'text', array: true, default: () => `'{}'` })
  grantedScopes!: string[];

  /** 健康检查路径（例如 /health），可空 */
  @Column({ type: 'varchar', nullable: true })
  healthCheckPath!: string | null;

  /** 归属团队/负责人（可用于审计/可观测），可空 */
  @Column({ type: 'varchar', nullable: true })
  ownerTeam!: string | null;

  /** 服务密钥（存储哈希） */
  @Column({ type: 'text' })
  serviceSecret!: string; // hashed

  @BeforeInsert()
  @BeforeUpdate()
  protected async hashServiceSecret(): Promise<void> {
    if (!this.serviceSecret) return;

    // 避免重复 hash
    if (this.serviceSecret.startsWith('$argon2')) return;

    this.serviceSecret = await argon2.hash(this.serviceSecret, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 5,
      parallelism: 1,
    });
  }

  /** 描述信息 */
  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'boolean', default: false })
  isActive?: boolean;

  /** 密钥版本（轮转用） */
  @Column({ type: 'int', default: 1 })
  secretVersion!: number;

  /** 最近一次密钥轮转时间 */
  @Column({ type: 'timestamptz', nullable: true })
  lastRotatedAt!: Date | null;

  /** 反向：本服务下的资源集合 */
  @OneToMany(() => Resource, r => r.service)
  resources!: Resource[];

  /** 反向：本服务下的路由集合（避免与历史 jsonb 字段重名） */
  @OneToMany(() => ServiceRoute, sr => sr.service)
  routes!: ServiceRoute[];
}
