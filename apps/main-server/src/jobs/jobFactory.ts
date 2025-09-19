import { Queue, Worker, QueueEvents, JobsOptions, Processor } from 'bullmq';
import type { ConnectionOptions } from 'bullmq';
import type IORedis from 'ioredis';
import { logger } from '../modules/common/libs/logger';

export type JobHandler = Processor<any, any, string>;

export type BaseSchedulerOpts = {
  id: string; // 调度器唯一 ID（用于幂等）
  data?: Record<string, any>;
  removeOnComplete?: boolean | number;
  removeOnFail?: boolean | number;
  startDate?: Date | string;
  endDate?: Date | string;
  limit?: number;
  tz?: string;
  immediately?: boolean; // 仅在 pattern (cron) 模式下生效
};

export type CronSchedulerOpts = BaseSchedulerOpts & { pattern: string; every?: never };
export type EverySchedulerOpts = BaseSchedulerOpts & { every: number; pattern?: never };
export type SchedulerOpts = CronSchedulerOpts | EverySchedulerOpts;

export type CreateJobRunnerOpts = {
  queueName: string;
  connection: IORedis | ConnectionOptions;
  handler: JobHandler;
  concurrency?: number;
  defaultJobOptions?: JobsOptions;
};

const toDate = (v?: string | Date) => (v ? new Date(v) : undefined);

export function createJobRunner({
  queueName,
  connection,
  handler,
  concurrency = 1,
  defaultJobOptions,
}: CreateJobRunnerOpts) {
  // 固定 <any, any, string>，规避 v5 类型推导问题
  const queue = new Queue<any, any, string>(queueName, {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: 1000,
      removeOnFail: 1000,
      ...defaultJobOptions,
    },
  });

  const events = new QueueEvents(queueName, { connection });

  const worker = new Worker<any, any, string>(
    queueName,
    async (job, token) => handler(job, token),
    { connection, concurrency }
  );

  worker.on('completed', job => logger.info(`[${queueName}] job ${job.id} completed`));
  worker.on('failed', (job, err) =>
    logger.error(`[${queueName}] job ${job?.id ?? 'unknown'} failed: ${err?.message}`)
  );
  worker.on('error', err => logger.error(`[${queueName}] worker error`, err));

  /**
   * 统一调度：
   * - 优先用 v5: upsertJobScheduler(id, repeatOpts, jobTemplate?)
   * - 失败/不支持则回退到 repeat（queue.add 的第三参）
   */
  async function schedule(opts: SchedulerOpts) {
    const startDate = toDate(opts.startDate);
    const endDate = toDate(opts.endDate);

    // 1) v5 repeatOpts：every 或 pattern（二选一）+ 可选项
    const repeatOpts: Record<string, any> = {};
    if ('every' in opts) {
      repeatOpts.every = opts.every;
      // 注意：every 模式下不要设置 immediately（BullMQ 会提示该选项无效）
    } else if ('pattern' in opts) {
      repeatOpts.pattern = opts.pattern;
      if (typeof opts.immediately === 'boolean') {
        repeatOpts.immediately = opts.immediately;
      }
    }
    if (startDate) repeatOpts.startDate = startDate;
    if (endDate) repeatOpts.endDate = endDate;
    if (opts.tz) repeatOpts.tz = opts.tz;
    if (typeof opts.limit === 'number') repeatOpts.limit = opts.limit;

    // 2) v5 jobTemplate：data + opts(removeOnComplete/removeOnFail/priority...)
    const jobTemplate: Record<string, any> = {};
    if (opts.data && Object.keys(opts.data).length) jobTemplate.data = opts.data;
    const jobOpts: Record<string, any> = {};
    if (opts.removeOnComplete !== undefined) jobOpts.removeOnComplete = opts.removeOnComplete;
    if (opts.removeOnFail !== undefined) jobOpts.removeOnFail = opts.removeOnFail;
    if (Object.keys(jobOpts).length) jobTemplate.opts = jobOpts;

    // 3) 优先调用 v5 三参签名
    const qAny = queue as unknown as {
      upsertJobScheduler?: (id: string, repeat: any, jobTemplate?: any) => Promise<any>;
    };

    if (typeof qAny.upsertJobScheduler === 'function') {
      try {
        return await qAny.upsertJobScheduler(
          opts.id,
          repeatOpts,
          Object.keys(jobTemplate).length ? jobTemplate : undefined
        );
      } catch (err) {
        logger.warn(
          `[${queueName}] upsertJobScheduler failed, fallback to repeat: ${(err as Error).message}`
        );
        // 继续走 fallback
      }
    }

    // 4) 回退：老版本 repeat（queue.add 的 opts.repeat）
    const repeat =
      'pattern' in opts
        ? { cron: opts.pattern, tz: opts.tz, startDate, endDate, limit: opts.limit }
        : { every: (opts as EverySchedulerOpts).every, startDate, endDate, limit: opts.limit };

    return queue.add(
      opts.id, // job name
      opts.data ?? {}, // job data
      {
        jobId: opts.id, // 幂等：固定 jobId 避免重复注册
        repeat,
        removeOnComplete: opts.removeOnComplete ?? true,
        removeOnFail: opts.removeOnFail ?? true,
      }
    );
  }

  async function close() {
    await Promise.allSettled([worker.close(), events.close(), queue.close()]);
  }

  return { queue, worker, events, schedule, close };
}
