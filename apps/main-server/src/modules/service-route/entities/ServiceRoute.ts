import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/BaseEntity';
import { Service } from '../../service-auth/entities/Service';
/** 路由清单 */
@Entity()
@Unique('ux_route_service_path_rewrite_not_deleted', ['service', 'path', 'rewrite'])
@Index('ix_route_service', ['service'])
export class ServiceRoute extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** 归属服务（以 serviceId 为自然键的 Service） */
  @ManyToOne(() => Service, { nullable: false, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'serviceId', referencedColumnName: 'id' })
  service!: Service;

  @Column({ type: 'uuid' })
  serviceId!: string;

  /** 路由路径（网关对外暴露，如 /booking、/users/:id） */
  @Column({ type: 'text' })
  path!: string;

  /** 允许方法集合（如 ['GET','POST']） */
  @Check('ck_route_methods_nonempty', `cardinality("methods") > 0`)
  @Column({ type: 'text', array: true })
  methods!: string[];

  /** 可选：网关重写规则（如 '^/booking'） */
  @Column({ type: 'text', nullable: true })
  rewrite?: string | null;

  /** 可选：限流策略（windowMs/max 等） */
  @Column({ type: 'jsonb', nullable: true })
  rateLimit?: Record<string, any> | null;

  /** 是否启用 */
  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
