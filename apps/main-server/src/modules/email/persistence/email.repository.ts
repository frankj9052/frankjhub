import { Repository } from 'typeorm';
import { EmailOutbox } from '../entities/EmailOutbox';
import { EmailStatus } from '@frankjhub/shared-schema';

export class EmailRepository {
  constructor(private repo: Repository<EmailOutbox>) {}

  createAndSave(data: Partial<EmailOutbox>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  findById(id: string) {
    return this.repo.findOneBy({ id });
  }
  findByIdemKey(key: string) {
    return this.repo.findOneBy({ idempotencyKey: key });
  }

  async markSending(id: string) {
    await this.repo.update(id, { status: 'sending' });
  }
  async markFinal(id: string, status: EmailStatus, providerMessageId?: string, lastError?: string) {
    await this.repo.update(id, { status, providerMessageId, lastError });
  }
}
