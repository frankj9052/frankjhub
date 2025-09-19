import { createJobRunner } from './jobFactory';
import { InvitationService } from '../modules/Invitation/invitation.service';
import type IORedis from 'ioredis';
import { INVITATION_EXPIRE_QUEUE, INVITATION_EXPIRE_SCHEDULER } from './constants';

export async function registerInvitationExpireJob(redis: IORedis) {
  const runner = createJobRunner({
    queueName: INVITATION_EXPIRE_QUEUE,
    connection: redis, // 直接用你现有的 redisClient
    handler: async () => {
      const svc = new InvitationService();
      await svc.expirePendingInvitations();
      return { ok: true };
    },
    concurrency: 1,
  });

  // 每 10 分钟执行一次；首次启动立即跑一次（v5 会 honor immediately；老版回退 repeat）
  await runner.schedule({
    id: INVITATION_EXPIRE_SCHEDULER,
    every: 10 * 60 * 1000,
    immediately: true,
    removeOnComplete: 1000,
    removeOnFail: 1000,
  });

  return runner; // 供主进程优雅关闭
}
