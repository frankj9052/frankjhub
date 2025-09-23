import { IEmailProvider } from '@frankjhub/shared-schema';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { DataSource } from 'typeorm';
import { EMAIL_QUEUE } from '../bullmq.email.queue';
import { EmailRepository } from '../../persistence/email.repository';
import { EmailOutbox } from '../../entities/EmailOutbox';

export function startEmailWorkder(connection: IORedis, ds: DataSource, provider: IEmailProvider) {
  return new Worker(
    EMAIL_QUEUE,
    async job => {
      const { emailId } = job.data;
      const repo = new EmailRepository(ds.getRepository(EmailOutbox));
      const email = await repo.findById(emailId);
      if (!email) return;

      await repo.markSending(email.id);
      try {
        const res = await provider.send({
          to: email.to,
          from: email.from,
          subject: email.subject,
          htmlBody: email.htmlBody ?? undefined,
          textBody: email.textBody ?? undefined,
          replyTo: email.replyTo ?? undefined,
        });
        await repo.markFinal(email.id, 'sent', res.providerMessageId);
      } catch (error) {
        await repo.markFinal(
          email.id,
          'failed',
          undefined,
          String((error as any)?.message ?? error)
        );
        throw error;
      }
    },
    { connection }
  );
}
