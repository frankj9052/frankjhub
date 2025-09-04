import { z, zInfer } from '../../../libs/z';
import { contactSchema } from '../entity';

export const contactCreateRequestSchema = contactSchema
  .pick({
    name: true,
    email: true,
    phone: true,
    subject: true,
    message: true,
  })
  .extend({
    /**
     * 在 Web 开发里，**honeypot field（蜜罐字段）**是一种 防止垃圾表单提交**（anti-spam） 的技术。
     * 简单，不依赖第三方（不像 reCAPTCHA 那样需要 Google 服务），对用户体验无影响。
     * 更高级的机器人可能会识别出隐藏字段并跳过，所以通常要结合其他方法（比如验证码、速率限制、IP 黑名单）。
     */
    hp_company: z.string().optional().or(z.literal('')), // honeypot field
  })
  .superRefine((data, ctx) => {
    const hasEmail = !!data.email?.length;
    const hasPhone = !!data.phone?.length;
    if (!hasEmail && !hasPhone) {
      const msg = 'Please provide at least an email or a phone number.';
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['email'], message: msg });
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['phone'], message: msg });
    }
  });

export type ContactCreateRequest = zInfer<typeof contactCreateRequestSchema>;
