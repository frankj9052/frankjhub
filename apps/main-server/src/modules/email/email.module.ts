import { DataSource } from 'typeorm';
import { env } from '../../config/env';
import { ResendProvider } from './adapters/resend.provider';
import { SendEmailUseCase } from './application/email.usecases';
import { EmailRepository } from './persistence/email.repository';
import { MjmlRenderer } from './renderer/mjml.renderer';
import { EmailOutbox } from './entities/EmailOutbox';
import { EmailSuppression } from './entities/EmailSuppression';
import IORedis from 'ioredis';
import { RedisConnectionError } from '../common/errors/RedisConnectionError';
import { createEmailQueue, defaultJobOptions } from './queue/bullmq.email.queue';
import { createLoggerWithContext } from '../common/libs/logger';
import { startEmailWorkder, stopEmailWorker } from './queue/workers/email.worker';
import { InternalServerError } from '../common/errors/InternalServerError';

export type EmailModule = {
  sendEmailUseCase: SendEmailUseCase;
  startWorker: () => Promise<void>;
  stopWorker: () => Promise<void>;
};

let singleton: EmailModule | undefined;

export async function initEmailModule({ ds, redis }: { ds: DataSource; redis?: IORedis }) {
  if (singleton) return singleton;

  const logger = createLoggerWithContext('initEmailModule');
  const provider = new ResendProvider(env.RESEND_API_KEY);
  const renderer = new MjmlRenderer();
  const repo = new EmailRepository(ds.getRepository(EmailOutbox));
  const suppressionRepo = ds.getRepository(EmailSuppression);

  let enqueue: ((id: string) => Promise<void>) | undefined;
  // let workerStarted = false;

  if (env.EMAIL_ENABLE_QUEUE === 'true') {
    if (!redis) throw new RedisConnectionError();
    const { queue } = createEmailQueue(redis);
    enqueue = async (emailId: string) => {
      queue.add('send', { emailId }, defaultJobOptions(Number(env.EMAIL_MAX_RETRY)));
    };
  }

  const sendEmailUseCase = new SendEmailUseCase(
    repo,
    suppressionRepo,
    provider,
    renderer,
    {
      from: env.RESEND_FROM_DEFAULT,
      replyTo: env.RESEND_REPLY_TO_DEFAULT,
      enableQueue: env.EMAIL_ENABLE_QUEUE === 'true',
      maxRetry: Number(env.EMAIL_MAX_RETRY),
    },
    enqueue
  );

  async function startWorker() {
    if (env.EMAIL_ENABLE_QUEUE !== 'true') {
      logger.info('[Email] Queue is forbidden in env, worker will not start');
      return;
    }
    if (!redis) throw new RedisConnectionError('Cannot start worder: redis not provided');
    startEmailWorkder(redis, ds, provider);
  }

  async function stopWorker() {
    await stopEmailWorker();
  }

  singleton = { sendEmailUseCase, startWorker, stopWorker };
  return singleton;
}

export function getEmailModule(): EmailModule {
  if (!singleton)
    throw new InternalServerError(
      'Email module has not been initialized, please call initEmailModule() first'
    );
  return singleton;
}
