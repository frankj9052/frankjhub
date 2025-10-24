import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/BaseEntity';
import { ServiceRoute } from '../../service-route/entities/ServiceRoute';
import { Resource } from '../../resource/entities/Resource';
import { Action } from '../../action/entities/Action';

/** “路由 ↔ 资源+动作”映射，一行一个 action */
@Entity()
@Unique('ux_rra_route_resource_action', ['route', 'resource', 'action'])
@Index('ix_rra_route', ['route'])
@Index('ix_rra_resource', ['resource'])
export class RouteResourceAction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** 路由 */
  @ManyToOne(() => ServiceRoute, { nullable: false, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'routeId' })
  route!: ServiceRoute;

  @Column({ type: 'uuid' })
  routeId!: string;

  /** 资源 */
  @ManyToOne(() => Resource, { nullable: false, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'resourceId' })
  resource!: Resource;

  @Column({ type: 'uuid' })
  resourceId!: string;

  /** 动作字典 */
  @ManyToOne(() => Action, { nullable: false, onDelete: 'RESTRICT', eager: true })
  @JoinColumn({ name: 'actionId' })
  action!: Action;

  @Column({ type: 'uuid' })
  actionId!: string;

  /**
   * 冗余缓存：动作名称（例如 'read'）
   * - 降少 join，便于快照/日志快速使用
   * - 由钩子保持同步（也可用 DB 触发器）
   */
  @Column({ type: 'varchar', length: 64 })
  actionName!: string;

  @BeforeInsert()
  @BeforeUpdate()
  syncActionName() {
    const name = (this.action as any)?.name || '';
    if (name) this.actionName = name;
  }
}
