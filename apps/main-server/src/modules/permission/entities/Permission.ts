import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';
import { buildPermissionName } from '../../codecs/permissionCodec';
import { BaseEntity } from '../../common/entities/BaseEntity';
import { Resource } from '../../resource/entities/Resource';
import { PermissionAction } from './PermissionAction';

@Entity()
@Index(['name'], { unique: true })
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * 全局唯一（在未删除状态下）：
   * 约定使用 canonical resource key + actions (+ fields/condition) 生成
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

  // { "ownerOnly": true }
  @Column({ type: 'jsonb', nullable: true })
  condition?: Record<string, unknown>;

  /**
   * 归属资源
   * - 外键列名固定为 resourceId，清晰直观
   * - 资源删除时联动删除权限
   */
  @ManyToOne(() => Resource, { nullable: false, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'resourceId' })
  resource!: Resource;

  /**
   * 关联的动作集合
   * - 这里仅声明反向关系；真正的外键/删除级联应在 PermissionAction 上定义
   * - 为了在 @BeforeInsert/@BeforeUpdate 中拿到 actionNames，开启 eager 或在服务层手动装载
   */
  @OneToMany(() => PermissionAction, pa => pa.permission, {
    cascade: ['insert', 'update'],
    eager: true,
  })
  permissionActions!: PermissionAction[];

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  /** 乐观锁，便于并发安全更新 */
  @VersionColumn()
  version!: number;

  /**
   * 在插入/更新前生成规范化权限名
   * 规则：buildPermissionName(resourceKey, actionNames, fields?, condition?)
   * - resourceKey 采用 Resource 的 canonical key：
   *   优先用实例方法 key()，否则回退到存储列 resource_key（生成列）
   */
  @BeforeInsert()
  @BeforeUpdate()
  public setName(): void {
    // 尝试拿到 canonical key
    const resourceKey =
      (typeof this.resource?.key === 'function' ? this.resource.key() : undefined) ||
      this.resource.resource_key ||
      '';
    const actionNames = this.permissionActions?.map(pa => pa.action?.name).filter(Boolean);

    if (!resourceKey || !actionNames?.length) return;

    this.name = buildPermissionName(resourceKey, actionNames, this.fields, this.condition);
  }
}
