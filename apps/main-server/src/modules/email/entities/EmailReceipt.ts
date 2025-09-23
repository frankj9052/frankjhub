import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/BaseEntity';

@Entity()
export class EmailReceipt extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar', length: 256 })
  providerMessageId!: string;

  @Index()
  @Column({ type: 'varchar', length: 64 })
  event!: string; // delivered/opened/clicked/bounced/complained 等

  @Column({ type: 'jsonb', nullable: true })
  payload?: Record<string, any>;
}
