import { BeforeInsert, BeforeUpdate, Column, Entity, Index, ManyToOne } from 'typeorm';
import { buildPermissionName } from '../../codecs/permissionCodec';
import { BaseEntity } from '../../common/entities/BaseEntity';
import { Resource } from '../../resource/entities/Resource';

@Entity()
@Index(['name'], { unique: true })
export class Permission extends BaseEntity {
  // 命名规则：buildPermissionName
  @Column({ type: 'varchar', length: 512 })
  name!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  description!: string;

  @Column('text', { array: true, nullable: true })
  fields?: string[]; // ['email', 'phone']

  // { "ownerOnly": true }
  @Column({ type: 'jsonb', nullable: true })
  condition?: Record<string, unknown>;

  @ManyToOne(() => Resource, { nullable: false })
  resource!: Resource;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  /** 非持久化字段，仅用于 name 构建 */
  private _actionNames?: string[];

  setActionsForNameBuild(actionNames: string[]) {
    this._actionNames = actionNames;
  }

  @BeforeInsert()
  @BeforeUpdate()
  protected setName(): void {
    if (!this.resource?.name || !this._actionNames) return;

    this.name = buildPermissionName(
      this.resource.name,
      this._actionNames,
      this.fields,
      this.condition
    );
  }
}
