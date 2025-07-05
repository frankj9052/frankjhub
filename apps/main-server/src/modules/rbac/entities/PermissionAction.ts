import { Column, Entity, ManyToOne } from 'typeorm';
import { Permission } from './Permission';
import { BaseEntity } from '../../common/entities/BaseEntity';
import { Action } from '../../action/entities/Action';

@Entity()
export class PermissionAction extends BaseEntity {
  @ManyToOne(() => Permission, { nullable: false })
  permission!: Permission;

  @ManyToOne(() => Action, { nullable: false })
  action!: Action;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
