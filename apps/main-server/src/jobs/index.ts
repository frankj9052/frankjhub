import type IORedis from 'ioredis';
import { createLoggerWithContext } from '../modules/common/libs/logger';
import { env } from '../config/env';
import type { JobRunner } from './types';

// 👇 引入各个 job 的注册函数
import { registerInvitationExpireJob } from './invitations.expire';

const log = createLoggerWithContext('Jobs');

/**
 * 注册所有计划任务
 * - 可用 ENABLE_SCHEDULERS 总开关
 * - 每个 job 也可以单独开关/配置
 */
export async function registerAllJobs(redis: IORedis): Promise<JobRunner[]> {
  const runners: JobRunner[] = [];
  const tasks: Array<Promise<void>> = [];

  const safeRegister = (name: string, reg: () => Promise<JobRunner>) => {
    tasks.push(
      reg()
        .then(r => {
          runners.push(r);
        })
        .catch(err => {
          log.error(`Register job ${name} failed`, err);
        })
    );
  };

  // 全局开关（默认开启；你也可以改成默认关闭）
  const schedulersEnabled = env.ENABLE_SCHEDULERS !== 'false';
  if (!schedulersEnabled) {
    log.warn('Schedulers disabled by env.ENABLE_SCHEDULERS');
    return runners;
  }

  // ---- 逐个注册（支持各自的 env 开关/间隔配置） ----

  // [Invitation Expire] 清理过期邀请
  if (env.ENABLE_INVITATION_EXPIRE !== 'false') {
    log.info('Registering job: invitation-expire');
    safeRegister('invitation-expire', () => registerInvitationExpireJob(redis));
  } else {
    log.info('Skip job: invitation-expire (disabled by env)');
  }

  // 未来新增更多任务时，只需在这里追加：
  // if (env.ENABLE_SOMETHING !== 'false') {
  //   const runner = await registerSomethingJob(redis);
  //   runners.push(runner);
  // }

  await Promise.all(tasks);

  return runners;
}
