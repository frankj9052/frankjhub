import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './Role';
import { Permission } from '../../permission/entities/Permission';
import { buildRolePermissionName } from '../../codecs/permissionCodec';
import { BaseEntity } from '../../common/entities/BaseEntity';

@Entity()
@Index(['name'], { unique: true })
@Index('ux_role_permission_pair', ['roleId', 'permissionId'], { unique: true })
export class RolePermission extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 512, nullable: false })
  name!: string;

  @Column({ type: 'boolean', default: true })
  isActive?: boolean;

  @Column({ type: 'uuid', name: 'permission_id' })
  permissionId!: string;

  /* 外键 */
  @ManyToOne(() => Permission, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permission_id' })
  permission!: Permission;

  @Column({ type: 'uuid', name: 'role_id' })
  roleId!: string;

  @ManyToOne(() => Role, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @BeforeInsert()
  @BeforeUpdate()
  protected setName(): void {
    if (!this.role?.code || !this.permission?.name) return;
    this.name = buildRolePermissionName(this.role.code, this.permission.name);
  }
}
