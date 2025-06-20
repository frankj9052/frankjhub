import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entities/BaseEntity';

@Entity()
export class OrganizationType extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;
}
