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
export class RolePermission extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 512, nullable: false })
  name!: string;

  @Column({ type: 'boolean', default: true })
  isActive?: boolean;

  /* 外键 */
  @ManyToOne(() => Permission, { nullable: false })
  @JoinColumn({ name: 'permission_id' })
  permission!: Permission;

  @ManyToOne(() => Role, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @BeforeInsert()
  @BeforeUpdate()
  protected setName(): void {
    if (!this.role?.code || !this.permission?.name) return;
    this.name = buildRolePermissionName(this.role.code, this.permission.name);
  }
}
