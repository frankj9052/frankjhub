import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/BaseEntity';
import { Service } from './Service';
import { Role } from '../../rbac/entities/Role';

@Entity()
export class ServiceRole extends BaseEntity {
  @ManyToOne(() => Service, { nullable: false })
  service!: Service;

  @ManyToOne(() => Role, { nullable: false })
  role!: Role;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
