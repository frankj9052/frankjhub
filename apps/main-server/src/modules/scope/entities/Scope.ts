import {
  BeforeInsert,
  BeforeUpdate,
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
import { Resource } from '../../resource/entities/Resource';
import { Action } from '../../action/entities/Action';
import { buildScopeKeyFrom } from '@frankjhub/shared-perm';

@Entity()
@Unique('ux_scope_key', ['key'])
@Unique('ux_scope_resource_action', ['resource', 'action'])
@Index('ix_scope_resource', ['resource'])
export class Scope extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** 资源 */
  @ManyToOne(() => Resource, { nullable: false, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'resourceId' })
  resource!: Resource;

  @Column({ type: 'uuid' })
  resourceId!: string;

  @Column({ type: 'varchar', length: 100 })
  resource_key!: string;

  /** 动作字典 */
  @ManyToOne(() => Action, { nullable: false, onDelete: 'RESTRICT', eager: true })
  @JoinColumn({ name: 'actionId' })
  action!: Action;

  @Column({ type: 'uuid' })
  actionId!: string;

  /** 冗余缓存：动作名称（如 'read'），便于快速拼 key */
  @Check('ck_scope_action_name_nonempty', `"action_name" <> ''`)
  @Column({ type: 'varchar', length: 64 })
  actionName!: string;

  /** 规范化 scope 字符串：<serviceId>.<entity>:<action> */
  @Check('ck_scope_key_nonempty', `"key" <> ''`)
  @Column({ type: 'varchar', length: 300 })
  key!: string;

  @BeforeInsert()
  @BeforeUpdate()
  hydrateAndBuildKey() {
    // 1) 同步 actionName
    const an = this.action?.name || '';
    if (an) this.actionName = an;
    const rk = this.resource.resource_key || '';
    if (rk) this.resource_key = rk;

    // 2) 拼装 key
    const ns = this.resource?.namespace || ''; // = serviceId
    const entity = this.resource?.entity || '';
    const qualifier = this.resource.qualifier || undefined;
    const actionName = (this.actionName || '').trim();
    if (!ns || !entity || !actionName) return;
    this.key = buildScopeKeyFrom(ns, entity, actionName, qualifier);
  }
}
