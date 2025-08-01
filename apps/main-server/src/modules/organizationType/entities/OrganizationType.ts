import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/BaseEntity';
import { Organization } from '../../organization/entities/Organization';

@Entity()
export class OrganizationType extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: '' })
  description?: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => Organization, org => org.orgType)
  organizations!: Organization[];
}
