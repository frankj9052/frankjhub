import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/BaseEntity';
import { Service } from './Service';
import { Role } from '../../role/entities/Role';

@Entity()
export class ServiceRole extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Service, { nullable: false })
  service!: Service;

  @ManyToOne(() => Role, { nullable: false })
  role!: Role;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
