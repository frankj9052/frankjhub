/**
 * 正常流程： QUEUED → SENDING → SENT → DELIVERED
 * 异常流程：
 * 投递失败：BOUNCED / FAILED
 * 被拦截：SUPPRESSED
 * 用户投诉：COMPLAINED
 */
export const EMAIL_STATUS = {
  QUEUED: 'queued', // 排队中: 邮件还没有开始发送，只是被放入发送队列中，等待邮件服务处理。
  SENDING: 'sending', // 发送中: 邮件已经交给邮件服务，正在尝试投递给目标邮件服务器
  SENT: 'sent', // 已发送: 邮件服务确认已成功将邮件交给目标邮件服务器
  DELIVERED: 'delivered', // 已投递: 收件方邮件服务器确认收到了邮件并接受投递
  BOUNCED: 'bounced', // 退信/无法送达: 邮件没有成功投递，比如邮箱不存在、收件人拒收、目标服务器错误
  COMPLAINED: 'complained', // 用户投诉/标记为垃圾邮件: 收件人或邮箱服务提供商将邮件标记为垃圾邮件或投诉
  FAILED: 'failed', // 发送失败: 邮件服务未能成功完成发送过程（可能是系统错误、超时、配置问题等），和 BOUNCED 不同，FAILED 通常是发送服务端的问题。
  SUPPRESSED: 'suppressed', // 被拦截/抑制发送: 邮件服务主动阻止发送，比如：该邮箱在你的“退订名单/屏蔽名单”中, 之前多次退信或投诉，被服务商拉黑, 避免对无效或危险地址重复投递
} as const;

export type EmailStatus = (typeof EMAIL_STATUS)[keyof typeof EMAIL_STATUS];
