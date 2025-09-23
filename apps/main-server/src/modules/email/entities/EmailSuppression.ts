import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/BaseEntity';

@Entity()
export class EmailSuppression extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 320 })
  email!: string;

  @Column({ type: 'varchar', length: 64 }) // reason: bounce/complaint/unsubscribe/manual
  reason!: string;
}
