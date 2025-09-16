import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/BaseEntity';
import { OrganizationType } from '../../organizationType/entities/OrganizationType';

@Entity()
export class Organization extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @ManyToOne(() => OrganizationType, orgType => orgType.organizations, { nullable: false })
  orgType!: OrganizationType;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
