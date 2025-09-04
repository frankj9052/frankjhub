import { BeforeInsert, BeforeUpdate, Column, Entity, Index, ManyToOne } from 'typeorm';
import { Organization } from '../../organization/entities/Organization';
import { BaseEntity } from '../../common/entities/BaseEntity';
import { User } from '../../user/entities/User';
import { buildFullUserOrgRoleName } from '../../codecs/permissionCodec';
import { Role } from '../../role/entities/Role';

@Entity()
@Index('IDX_uor_name', ['name'], { unique: true })
export class UserOrganizationRole extends BaseEntity {
  @Column({ type: 'varchar', length: 512, nullable: false })
  name!: string;

  /* 外键 */
  @ManyToOne(() => User, org => org.userOrganizationRoles, { nullable: false, onDelete: 'CASCADE' })
  @Index()
  user!: User;

  @ManyToOne(() => Organization, { nullable: false })
  @Index()
  organization!: Organization;

  @ManyToOne(() => Role, { nullable: false })
  @Index()
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
