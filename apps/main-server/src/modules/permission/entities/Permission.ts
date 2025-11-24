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
  VersionColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/BaseEntity';
import { Resource } from '../../resource/entities/Resource';
import { Action } from '../../action/entities/Action';
import { PERMISSION_EFFECT, PermissionEffect } from '@frankjhub/shared-schema';
import { arrayToString, safeJsonStringify } from '@frankjhub/shared-utils';
import { buildSingleActionPermissionName } from '@frankjhub/shared-perm';

@Entity()
@Index(['name'], { unique: true })
@Unique('ux_perm_resource_action_fields_cond_eff', [
  'resourceId',
  'actionId',
  'fieldsHash',
  'conditionHash',
  'effect',
])
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** 规范化权限名（展示/外键友好），例如：
   *  main.user:[read]@name,email?orgId=123
   */
  @Column({ type: 'varchar', length: 512 })
  name!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  description!: string;

  /**
   * 字段白名单（可选）：用于进一步限定 Permission 的可见字段
   * 与 Resource.fields 风格保持一致：text[] + 默认空数组
   */
  @Column('text', { array: true, default: () => `'{}'` })
  fields?: string[]; // ['email', 'phone']

  /** 为唯一约束预计算的“字段哈希”（简单版：排序后用逗号连接；需要可换成真正哈希） */
  @Column({ type: 'varchar', length: 256, default: '' })
  fieldsHash!: string;

  /** ABAC 条件（JSON，可空） */
  @Column({ type: 'jsonb', nullable: true })
  condition?: Record<string, unknown>;

  /** 条件“哈希”（简单版：稳定 JSON 字符串；需要可换成真正哈希） */
  @Column({ type: 'varchar', length: 1024, default: '' })
  conditionHash!: string;

  /**
   * 归属资源
   * - 外键列名固定为 resourceId，清晰直观
   * - 资源删除时联动删除权限
   */
  @ManyToOne(() => Resource, { nullable: false, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'resource_id' })
  resource!: Resource;

  @Column({ type: 'uuid', name: 'resource_id' })
  resourceId!: string;

  @Column({ type: 'varchar', length: 100 })
  resource_key!: string;

  /** 动作（统一指向全局 Action 字典；建议 onDelete: RESTRICT 防止误删动作） */
  @ManyToOne(() => Action, { nullable: false, onDelete: 'RESTRICT', eager: true })
  @JoinColumn({ name: 'action_id' })
  action!: Action;

  @Column({ type: 'uuid', name: 'action_id' })
  actionId!: string;

  /** 冗余缓存动作名（与 Action.name 一致，便于拼 name/少 join） */
  @Column({ type: 'varchar', length: 64 })
  actionName!: string;

  /** 允许/拒绝此permission, deny优先allow */
  @Column({ type: 'enum', enum: PERMISSION_EFFECT, default: PERMISSION_EFFECT.ALLOW })
  effect!: PermissionEffect;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  /** 乐观锁，便于并发安全更新 */
  @VersionColumn()
  version!: number;

  @BeforeInsert()
  @BeforeUpdate()
  hydrateAndSetName() {
    // 1) 同步 actionName
    const an = this.action?.name || '';
    if (an) this.actionName = an;
    const rk = this.resource.resource_key || '';
    if (rk) this.resource_key = rk;

    this.fieldsHash = arrayToString(this.fields); // 需要更强一致性可换 sha1

    this.conditionHash = safeJsonStringify(this.condition);

    // 4) 生成规范化权限名
    const resourceKey =
      (typeof this.resource?.key === 'function' ? this.resource.key() : undefined) ||
      this.resource?.resource_key ||
      '';

    if (resourceKey && this.actionName) {
      this.name = buildSingleActionPermissionName(
        resourceKey,
        this.actionName,
        this.fields,
        this.condition ?? undefined
      );
    }
  }
}
