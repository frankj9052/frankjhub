import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as argon2 from 'argon2';
import { BaseEntity } from '../../common/entities/BaseEntity';

@Entity()
export class Service extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  serviceId!: string;

  @Column({ type: 'text' })
  serviceSecret!: string; // hashed secret

  @BeforeInsert()
  @BeforeUpdate()
  protected async hashServiceSecret(): Promise<void> {
    if (!this.serviceSecret) return;

    // 避免重复 hash
    if (this.serviceSecret.startsWith('$argon2')) return;

    this.serviceSecret = await argon2.hash(this.serviceSecret, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 5,
      parallelism: 1,
    });
  }

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: false })
  isActive!: boolean;
}
