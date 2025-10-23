/** BullMQ 队列名统一在此集中管理 */
export const Queues = {
  SNAPSHOT_REFRESH: 'queue:snapshot:refresh',
  EMAIL: 'queue:email',
} as const;
export type QueueName = (typeof Queues)[keyof typeof Queues];
