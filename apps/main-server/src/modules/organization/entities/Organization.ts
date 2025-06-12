import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/BaseEntity';
import { OrganizationCategory } from './OrganizationCategory';

@Entity()
export class Organization extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @ManyToOne(() => OrganizationCategory, { nullable: false })
  category?: OrganizationCategory;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
