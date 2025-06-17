import { BeforeInsert, BeforeUpdate, Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { buildRoleCode } from '../../codecs/permissionCodec';
import { Organization } from '../../organization/entities/Organization';
import { BaseEntity } from '../../common/entities/BaseEntity';
import { RoleSource } from '../../common/enums/roleSource.enum';
import { OrganizationType } from '../../organization/entities/OrganizationType';

@Entity()
@Index(['name', 'roleSource', 'organizationType', 'organization'], { unique: true })
@Index(['code'], { unique: true })
export class Role extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  code!: string;

  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  description!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  /**
   * Source type of the role
   * - 'type': template role bound to an organization type
   * - 'org': custom role belonging to a specific organization
   */
  @Column({ type: 'enum', enum: RoleSource, default: RoleSource.TYPE })
  roleSource!: RoleSource;

  @ManyToOne(() => OrganizationType, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationTypeId' })
  organizationType?: OrganizationType;

  @ManyToOne(() => Organization, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId' })
  organization?: Organization;

  @BeforeInsert()
  @BeforeUpdate()
  protected setCode(): void {
    const roleName = this.name?.toLowerCase().trim();
    if (!roleName || !this.roleSource) return;

    if (this.roleSource === RoleSource.ORG && this.organization?.id) {
      this.code = buildRoleCode(RoleSource.ORG, this.organization.id, roleName);
    } else if (this.roleSource === RoleSource.TYPE && this.organizationType?.id) {
      this.code = buildRoleCode(RoleSource.TYPE, this.organizationType.id, roleName);
    }
  }
}
