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
import { Scope } from '../../scope/entities/Scope';

@Entity()
@Unique('ux_route_scope', ['route', 'scope'])
export class RouteScope extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ServiceRoute, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'route_id' })
  route!: ServiceRoute;

  @Column({ type: 'uuid', name: 'route_id' })
  routeId!: string;

  @ManyToOne(() => Scope, { nullable: false, onDelete: 'RESTRICT', eager: true })
  @JoinColumn({ name: 'scope_id' })
  scope!: Scope;

  @Column({ type: 'uuid', name: 'scope_id' })
  scopeId!: string;

  // 冗余，便于快照/日志
  @Index()
  @Column({ type: 'varchar', length: 300 })
  scopeKey!: string;

  @BeforeInsert()
  @BeforeUpdate()
  syncScopeKey() {
    if (this.scope?.key) this.scopeKey = this.scope.key;
  }
}
