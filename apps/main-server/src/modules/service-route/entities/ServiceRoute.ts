import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/BaseEntity';
import { Service } from '../../service-auth/entities/Service';
import { AUTH_MODE, AuthMode, ROUTE_RULE_TYPE, RouteRuleType } from '@frankjhub/shared-schema';
import { RouteScope } from '../../routeScope/entities/RouteScope';
/** 路由清单 */
@Entity()
@Unique('ux_route_service_path_rule_rewrite_not_deleted', [
  'service',
  'path',
  'routeRuleType',
  'rewrite',
]) // ⬅️ 将 routeRuleType 纳入唯一键
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

  /** 路由匹配类型（exact/prefix） */
  @Column({ type: 'text', default: ROUTE_RULE_TYPE.EXACT })
  routeRuleType!: RouteRuleType;

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

  /** 授权组合模式（路由层面的 ANY/ALL），配合 RouteScope 多行记录 */
  @Column({ type: 'enum', enum: AUTH_MODE, default: AUTH_MODE.ANY })
  authMode!: AuthMode;

  @OneToMany(() => RouteScope, rs => rs.route, {
    cascade: false, // 不级联创建/更新
    eager: false, // 需要时再手动加载
    orphanedRowAction: 'delete', // 可选：仅当通过关系移除时，删除孤儿（谨慎使用）
  })
  scopes?: RouteScope[];
}
