import { JobsOptions, Queue } from 'bullmq';
import IORedis from 'ioredis';

export const EMAIL_QUEUE = 'email_send';

export function createEmailQueue(connection: IORedis) {
  const queue = new Queue(EMAIL_QUEUE, { connection });
  return { queue };
}

export function defaultJobOptions(maxRetry = 3): JobsOptions {
  return {
    attempts: maxRetry,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: 2000,
    removeOnFail: 2000,
  };
}
