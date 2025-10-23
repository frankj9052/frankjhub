/** Pub/Sub 通道名（固定值），与事件解耦 */
export const Channels = {
  SNAPSHOT_EVENTS: 'snapshot:events',
  USER_EVENTS: 'user:events',
} as const;

export type Channel = (typeof Channels)[keyof typeof Channels];
