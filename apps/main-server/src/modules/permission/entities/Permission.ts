import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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

  @OneToMany(() => PermissionAction, pa => pa.permission, { nullable: false, onDelete: 'CASCADE' })
  permissionActions!: PermissionAction[];

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  public setName(): void {
    const resourceName = this.resource?.name;
    const actionNames = this.permissionActions?.map(pa => pa.action?.name).filter(Boolean);

    if (!resourceName || !actionNames?.length) return;

    this.name = buildPermissionName(resourceName, actionNames, this.fields, this.condition);
  }
}
