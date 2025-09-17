import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Organization } from '../../organization/entities/Organization';
import { Role } from '../../role/entities/Role';
import { INVITATION_STATUS, InvitationStatus } from '@frankjhub/shared-schema';
import { User } from '../../user/entities/User';

@Entity()
@Index('ix_inv_org', ['organization'])
@Index('ix_inv_email', ['email'])
@Index('ix_inv_status', ['status'])
@Index('ix_inv_expires_at', ['expiresAt'])
@Index('ix_inv_token_hash', ['tokenHash']) // 验证时快速定位
@Unique('uq_inv_pending_org_email_role', ['organization', 'email', 'targetRole']) // 防止重复发相同邀请
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Organization, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId' })
  organization!: Organization;

  @Column('uuid')
  organizationId!: string;

  // 目标角色
  @ManyToOne(() => Role, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'targetRoleId' })
  targetRole!: Role;

  @Column('uuid')
  targetRoleId!: string;

  // 被邀请的邮箱（全小写、去空格）
  @Column({ type: 'varchar', length: 320 })
  email!: string;

  // 邀请状态
  @Column({ type: 'enum', enum: INVITATION_STATUS, default: INVITATION_STATUS.PENDING })
  status!: InvitationStatus;

  // 邀请人
  @ManyToOne(() => User, { nullable: false, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'inviterUserId' })
  inviterUser!: User;

  @Column({ type: 'uuid', nullable: true })
  inviterUserId!: string | null;

  // 接受者
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'acceptedUserId' })
  acceptedUser?: User | null;

  @Column({ type: 'uuid', nullable: true })
  acceptedUserId?: string | null;

  // 过期时间,3天
  @Column({ type: 'timestamptz' })
  expiresAt!: Date;

  // token 只存哈希, 明文 token 通过邮件链接下发
  @Column({ type: 'varchar', length: 255 })
  tokenHash!: string;
}
