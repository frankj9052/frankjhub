import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from './Permission';
import { BaseEntity } from '../../common/entities/BaseEntity';
import { Action } from '../../action/entities/Action';

@Entity()
export class PermissionAction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Permission, { nullable: false })
  permission!: Permission;

  @ManyToOne(() => Action, { nullable: false })
  action!: Action;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
