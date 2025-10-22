import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as argon2 from 'argon2';
import { BaseEntity } from '../../common/entities/BaseEntity';
import { ServiceRoute } from '@frankjhub/shared-schema';

@Entity()
export class Service extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** 自然键：如 'booking'、'shift'*/
  @Column({ type: 'varchar', length: 100, unique: true })
  serviceId!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar' })
  baseUrl!: string; // 例: http://booking:4001

  @Column({ type: 'varchar', default: 'api://' })
  audPrefix!: string; // 例: api://booking

  @Column({ type: 'jsonb', default: [] })
  routes!: ServiceRoute[];

  /** 服务级最低要求（网关层，全部路由生效；路由级可叠加覆盖） */
  @Column({ type: 'text', array: true, default: [] })
  requiredScopes!: string[];

  @Column({ type: 'varchar', nullable: true })
  healthCheckPath?: string;

  @Column({ type: 'varchar', nullable: true })
  ownerTeam?: string;

  @Column({ type: 'text' })
  serviceSecret!: string; // hashed secret

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

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: false })
  isActive!: boolean;

  @Column({ type: 'int', default: 1 })
  secretVersion!: number;

  @Column({ type: 'timestamptz', nullable: true })
  lastRotatedAt?: Date;
}
