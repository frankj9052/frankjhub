import {
  EMAIL_CHANNEL,
  EMAIL_PROVIDER,
  EMAIL_STATUS,
  EmailChannel,
  EmailProvider,
  EmailStatus,
} from '@frankjhub/shared-schema';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/BaseEntity';

@Entity()
export class EmailOutbox extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar', length: 320 })
  to!: string;

  @Column({ type: 'varchar', length: 320, nullable: true })
  cc?: string;

  @Column({ type: 'varchar', length: 320, nullable: true })
  bcc?: string;

  @Column({ type: 'varchar', length: 320 })
  from!: string;

  @Column({ type: 'varchar', length: 320, nullable: true })
  replyTo?: string;

  @Column({ type: 'varchar', length: 512 })
  subject!: string;

  // 模板与变量（JSON）
  @Index()
  @Column({ type: 'varchar', length: 128, nullable: true })
  templateKey?: string; // e.g., 'transactional.invitation'

  @Column({ type: 'jsonb', nullable: true })
  templateVars?: Record<string, any>;

  // 渲染后的 HTML/文本摘要（审计）
  @Column({ type: 'text', nullable: true })
  htmlBody?: string;

  @Column({ type: 'text', nullable: true })
  textBody?: string;

  @Column({ type: 'enum', enum: EMAIL_CHANNEL, default: EMAIL_CHANNEL.TRANSACTIONAL })
  channel!: EmailChannel;

  @Column({ type: 'enum', enum: EMAIL_STATUS, default: EMAIL_STATUS.QUEUED })
  status!: EmailStatus;

  // 第三方 Provider 侧 messageId
  @Index()
  @Column({ type: 'varchar', length: 256, nullable: true })
  providerMessageId?: string;

  @Column({ type: 'enum', enum: EMAIL_PROVIDER, default: EMAIL_PROVIDER.RESEND })
  provider!: EmailProvider;

  // 幂等键（例如业务单据 + 模板Key + 收件人 + hash）
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 128, nullable: true, unique: true })
  idempotencyKey?: string;

  @Column({ type: 'int', default: 0 })
  attempt!: number;

  @Column({ type: 'text', nullable: true })
  lastError?: string;

  // 可选：业务追踪 ID（例如邀请 ID）
  @Index()
  @Column({ type: 'varchar', length: 128, nullable: true })
  traceId?: string;
}
