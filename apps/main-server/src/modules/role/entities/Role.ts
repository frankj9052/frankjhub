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
} from 'typeorm';
import { buildRoleCode } from '../../codecs/permissionCodec';
import { Organization } from '../../organization/entities/Organization';
import { BaseEntity } from '../../common/entities/BaseEntity';
import { OrganizationType } from '../../organizationType/entities/OrganizationType';
import { RolePermission } from './RolePermission';
import { RoleSource } from '@frankjhub/shared-schema';

@Entity()
@Index(['name', 'roleSource', 'organizationType', 'organization'], { unique: true })
@Index(['code'], { unique: true })
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  code!: string;

  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  description?: string;

  @Column({ type: 'boolean', default: true })
  isActive?: boolean;

  /**
   * Source type of the role
   * - 'type': template role bound to an organization type
   * - 'org': custom role belonging to a specific organization
   */
  @Column({ type: 'enum', enum: RoleSource, default: RoleSource.TYPE })
  roleSource?: RoleSource;

  @Column({ type: 'uuid', nullable: true, name: 'organization_type_id' })
  organizationTypeId?: string | null;

  @ManyToOne(() => OrganizationType, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_type_id' })
  organizationType?: OrganizationType | null;

  @Column({ type: 'uuid', nullable: true, name: 'organization_id' })
  organizationId?: string | null;

  @ManyToOne(() => Organization, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization?: Organization | null;

  @OneToMany(() => RolePermission, rp => rp.role, { nullable: true, onDelete: 'CASCADE' })
  rolePermissions!: RolePermission[];

  @BeforeInsert()
  @BeforeUpdate()
  public setCode(): void {
    if (!this.name || !this.roleSource) return;

    if (this.roleSource === RoleSource.ORG && this.organization?.name) {
      this.code = buildRoleCode(RoleSource.ORG, this.organization.name, this.name);
    } else if (this.roleSource === RoleSource.TYPE && this.organizationType?.name) {
      this.code = buildRoleCode(RoleSource.TYPE, this.organizationType.name, this.name);
    }
  }
}
