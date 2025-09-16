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
import { Organization } from '../../organization/entities/Organization';
import { BaseEntity } from '../../common/entities/BaseEntity';
import { User } from '../../user/entities/User';
import { buildFullUserOrgRoleName } from '../../codecs/permissionCodec';
import { Role } from '../../role/entities/Role';

@Entity()
@Unique('uq_uor_user_org_role', ['user', 'organization', 'role'])
@Index('IDX_uor_name', ['name'], { unique: true })
@Index('ix_uor_user', ['user'])
@Index('ix_uor_org', ['organization'])
@Index('ix_uor_role', ['role'])
export class UserOrganizationRole extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 512, nullable: false })
  name!: string;

  /* 外键 */
  @ManyToOne(() => User, u => u.userOrganizationRoles, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Organization, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId' })
  organization!: Organization;

  @ManyToOne(() => Role, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role!: Role;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  protected setName(): void {
    if (!this.user?.id || !this.organization?.id || !this.role?.id) {
      return;
    }
    this.name = buildFullUserOrgRoleName(this.user.id, this.organization.id, this.role.code);
  }
}
